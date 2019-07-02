using System;
using System.Net;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Web.DigitalSignature
{
	public class ProxyHandler
	{
		private static string HttpRequestParameterAddress = "address";
		private static string HttpContentTypeMultipart = "multipart/form-data";
		private static string HttpContentTypeBase64 = "X-user/base64-data";
		private static int HttpMaxContentSize = 10000000;
		private static int HttpBufferChunk = 0xFFFF;

		private static bool UseProxy = false;
		private static string ProxyAddress = "";
		private static int ProxyPort = 3128;
		private static string ProxyUser = "";
		private static string ProxyPassword = "";

		private static string[] KnownHosts = {
			"czo.gov.ua",
			"acskidd.gov.ua",
			"ca.informjust.ua",
			"csk.uz.gov.ua",
			"masterkey.ua",
			"ocsp.masterkey.ua",
			"tsp.masterkey.ua",
			"ca.ksystems.com.ua",
			"csk.uss.gov.ua",
			"csk.ukrsibbank.com",
			"acsk.privatbank.ua",
			"ca.mil.gov.ua",
			"acsk.dpsu.gov.ua",
			"acsk.er.gov.ua",
			"ca.mvs.gov.ua",
			"canbu.bank.gov.ua",
			"uakey.com.ua",
			"ca.csd.ua",
			"altersign.com.ua",
			"ca.altersign.com.ua",
			"ocsp.altersign.com.ua",
			"acsk.uipv.org",
			"ocsp.acsk.uipv.org",
			"acsk.treasury.gov.ua"
		};

		private RequestDelegate _next;

		public ProxyHandler(RequestDelegate next)
		{
			_next = next;
		}

		private bool IsKnownHost(string uriValue)
		{
			try
			{
				if (!uriValue.Contains("://"))
					uriValue = "http://" + uriValue;

				Uri uri = new Uri(uriValue);
				string host = uri.Host;

				if (host == null || host == "")
					host = uriValue;

				host = host.ToLower();
				foreach (string knownHost in KnownHosts)
					if (knownHost == host)
						return true;
			}
			catch (Exception ex)
			{
			}

			return false;
		}

		private string GetContentType(string uriValue)
		{
			try
			{
				if (!uriValue.Contains("://"))
					uriValue = "http://" + uriValue;

				Uri uri = new Uri(uriValue);
				string path = uri.AbsolutePath;
				char[] lastChars = { '/' };

				if (path == null || path == "")
					return "";

				path = path.TrimEnd(lastChars);
				path = path.ToLower();
				if (path == "/services/cmp")
				{
					return "";
				}
				else if (path == "/services/ocsp" ||
						path == "/public/ocsp")
				{
					return "application/ocsp-request";
				}
				else if (path == "/services/tsp")
				{
					return "application/timestamp-query";
				}
				else
				{
					return "";
				}
			}
			catch (Exception ex)
			{
				return "";
			}
		}

		private byte[] SafeReadDataStream(Stream stream)
		{
			byte[] buffer;
			int count;
			MemoryStream memoryStream;
			StreamReader streamReader;

			buffer = new byte[HttpBufferChunk];
			memoryStream = new MemoryStream();
			streamReader = new StreamReader(stream);

			while ((count = streamReader.BaseStream.Read(buffer, 0, buffer.Length)) > 0)
			{
				memoryStream.Write(buffer, 0, count);

				if (memoryStream.Length > HttpMaxContentSize)
					return null;
			}

			return memoryStream.ToArray();
		}


		private async Task<HttpStatusCode> HandleRequest(HttpContext context)
		{
			HttpWebRequest serverRequest;
			HttpWebResponse serverResponse;
			string requestAddress;
			byte[] clientResponseData;

			requestAddress =
				context.Request.Query[HttpRequestParameterAddress];

			var base64Reponse = ((string)context.Request.Query["no64"]) == null;

			if (string.IsNullOrEmpty(requestAddress))
			{
				return HttpStatusCode.BadRequest;
			}

			serverRequest = (HttpWebRequest)WebRequest.Create(requestAddress);
			if (UseProxy)
			{
				serverRequest.Proxy = new WebProxy(ProxyAddress, ProxyPort);
				serverRequest.Proxy.Credentials = new NetworkCredential(
					ProxyUser, ProxyPassword);
			}

			serverRequest.Timeout = 60 * 1000;
			serverRequest.ReadWriteTimeout = 60 * 1000;
			serverRequest.Method = context.Request.Method;
			serverRequest.ServicePoint.Expect100Continue = false;

			if (serverRequest.Method == "POST")
			{
				byte[] requestData;
				string requestDataBase64String;
				byte[] serverRequestData;

				if (!context.Request.ContentType.Contains(HttpContentTypeBase64))
					return HttpStatusCode.BadRequest;

				requestData = SafeReadDataStream(context.Request.Body);

				if (requestData == null)
					return HttpStatusCode.RequestEntityTooLarge;

				requestDataBase64String =
					System.Text.Encoding.UTF8.GetString(requestData);
				serverRequestData = Convert.FromBase64String(
					requestDataBase64String);

				serverRequest.ContentType = GetContentType(requestAddress);
				serverRequest.ContentLength = serverRequestData.Length;
				var requestStream = serverRequest.GetRequestStream();
				await requestStream.WriteAsync(serverRequestData, 0, serverRequestData.Length);
				requestStream.Close();
			}


			serverResponse = (HttpWebResponse)serverRequest.GetResponse();
			if (serverResponse.StatusCode != HttpStatusCode.OK)
				return serverResponse.StatusCode;

			clientResponseData = SafeReadDataStream(
				serverResponse.GetResponseStream());
			if (clientResponseData == null)
			{
				serverResponse.Close();

				return HttpStatusCode.RequestEntityTooLarge;
			}

			serverResponse.Close();

			if (base64Reponse)
			{
				context.Response.ContentType = HttpContentTypeBase64;
			}

			context.Response.StatusCode = (int)HttpStatusCode.OK;
			if (base64Reponse)
			{
				await context.Response.WriteAsync(Convert.ToBase64String(clientResponseData));
			}
			else
			{
				await context.Response.Body.WriteAsync(clientResponseData);
			}

			return HttpStatusCode.OK;
		}

		public async Task Invoke(HttpContext context)
		{
			//  
			if (!context.Request.Path.ToString().EndsWith("/ProxyHandler.ashx"))
			{
				await _next(context);
				return;
			}

			HttpStatusCode status = HttpStatusCode.InternalServerError;

			try
			{
				string requestType = context.Request.Method;

				if (requestType == "GET" || requestType == "POST")
					status = await HandleRequest(context);
				else
					status = HttpStatusCode.BadRequest;
			}
			finally
			{
				if (status != HttpStatusCode.OK)
				{
					context.Response.StatusCode = (int)status;
					await context.Response.WriteAsync(@"Виникла помилка при обробці запиту");
				}
			}
		}

		public bool IsReusable
		{
			get { return false; }
		}
	}
}