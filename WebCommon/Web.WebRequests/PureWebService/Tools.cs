using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using Web.Tools;

namespace Web.WebRequests
{
	/// <summary>
	/// Вспомогательные методы
	/// </summary>
	public static class Tools
	{
		public static readonly List<string> UnsafeExtension = new List<string>
		{
			".com",
			".dll",
			".exe",
			".bat",
			".cmd"
		};

		public const string AuthCookieGetParamName = "ach";

		
		/// <summary>
		/// Выполнить http-get запрос
		/// </summary>
		/// <param name="url"></param>
		/// <returns></returns>
		internal static string HttpGetRequest(string url)
		{
			var request = WebRequest.Create(url);
			using (var responseStream = request.GetResponse().GetResponseStream())
			{
				if (responseStream == null)
				{
					return String.Empty;
				}
				using (var reader = new StreamReader(responseStream))
				{
					return reader.ReadToEnd();
				}
			}
		}

//		/// <summary>
//		/// Получить путь к временному каталогу
//		/// </summary>
//		/// <returns></returns>
//		public static string GetTempPath()
//		{
//			// В режиме отладки всегда используем m.it.ua
//#if DEBUG
//			return @"\\m\web\temp";
//
//#else
//			if (HttpContext.Current != null && HttpContext.Current.Session != null)
//			{
//				var overridedTemp = (string) HttpContext.Current.Session["OVERRIDED_TEMP"];
//				if (!string.IsNullOrEmpty(overridedTemp))
//				{
//					return overridedTemp;
//				}
//			}
//			var temp = ConfigurationManager.AppSettings["TEMP_FOLDER"];
//			if (!string.IsNullOrEmpty(temp))
//			{
//				return temp;
//			}
//			const string tempFolderName = "Temp";
//			// Получить папку на уровень выше, чем корневой каталог веб-сервисов
//			var root = HostingEnvironment.MapPath("~");
//			var rootParent = Directory.GetParent(root);
//			if (root.EndsWith(@"\"))
//			{
//				rootParent = Directory.GetParent(rootParent.FullName);
//			}
//
//			if (!rootParent.Exists)
//			{
//				return string.Empty;
//			}
//
//			// Сформировать путь
//			return Path.Combine(rootParent.FullName, tempFolderName);
//#endif
//		}

//		/// <summary>
//		/// Добавить файл во временной каталог
//		/// </summary>
//		/// <param name="fileName">Реальное имя файла</param>
//		/// <param name="content">Содержимое</param>
//		/// <returns>Имя файла во временном каталоге</returns>
//		public static string AddFileToTempFolder(string fileName, byte[] content)
//		{
//			var temp = GetTempPath();
//			var fileExtension = Path.GetExtension(fileName);
//			var tempName = Path.ChangeExtension(Path.GetRandomFileName(), fileExtension);
//			File.WriteAllBytes(Path.Combine(temp, tempName), content);
//			return tempName;
		//}

//		private static string getFileHandlerBaseUrl()
//		{
//			return VirtualPathUtility.ToAbsolute("~/ws/GetFile.ashx");
//		}
//
//		/// <summary>
//		/// Получить ссылку на файл
//		/// </summary>
//		/// <param name="tempName">Имя временного файла</param>
//		/// <param name="fileName">Имя файла, которое надо получить в результате</param>
//		public static string GetFileHandler(string tempName, string fileName)
//		{
//			return String.Concat(getFileHandlerBaseUrl(), "?file=", tempName, "&", "name=", HttpContext.Current.Server.UrlEncode(fileName));
//		}

//		/// <summary>
//		/// Получить ссылку на файл
//		/// </summary>
//		/// <param name="tempName">Имя временного файла</param>
//		public static string GetFileHandler(string tempName)
//		{
//			return String.Concat(getFileHandlerBaseUrl(), "?file=", tempName);
//		}
//
//		/// <summary>
//		/// Значение http-заголовка content-disposition
//		/// </summary>
//		/// <param name="fileName"></param>
//		/// <returns></returns>
//		public static string GetContentDisposition(string fileName)
//		{
//			var request = HttpContext.Current.Request;
//
//			if (request.Browser.Browser == "IE" && (request.Browser.Version == "7.0" || request.Browser.Version == "8.0"))
//			{
//				return "attachment; filename=" + Uri.EscapeDataString(fileName);
//			}
//			return string.Format("attachment; filename=\"{0}\"; filename*=UTF-8''{1}", fileName, Uri.EscapeDataString(fileName));
//		}

//		/// <summary>
//		/// Получить ссылку с get-параметром для автоматической авторизации
//		/// </summary>
//		/// <param name="pageUrl">Базовая ссылка</param>
//		/// <param name="authCookieName">Имя cookie, в котором храняться параметры аутентификации</param>
//		/// <returns></returns>
//		public static string GetAuthUrl(string pageUrl = null, string authCookieName = null)
//		{
//			if (authCookieName == null)
//			{
//				authCookieName = FormsAuthentication.FormsCookieName;
//			}
//			var cookie = HttpContext.Current.Request.Cookies[authCookieName];
//			if (cookie == null)
//			{
//				return pageUrl;
//			}
//			var cookieValue = cookie.Value;
//			// создаем get-параметр с именем ach, добавляем в url
//			// также добавляем в значение текущее время. Принимающая сторона не будет выполнять аутентификацию, если с момента генерации прошло больше двух минут
//			var getParam = GetAuthGetParams(cookieValue);
//			pageUrl = !string.IsNullOrEmpty(pageUrl) ? (pageUrl + (pageUrl.Contains("?") ? "&" : "?")) : string.Empty;
//			return string.Concat(pageUrl, getParam);
//		}

		/// <summary>
		/// Расшифровать cookie переданный get-параметром
		/// </summary>
		/// <param name="paramValue"></param>
		/// <returns></returns>
		public static string DecryptAuthCookieFromGetParam(string paramValue)
		{
			return Crypt.Decrypt(paramValue, string.Empty);
		}

//		/// <summary>
//		/// Получить имя пользователя из cookie
//		/// </summary>
//		/// <param name="cookieValue"></param>
//		/// <returns></returns>
//		public static string GetUserFromAuthCookie(string cookieValue)
//		{
//			var authTicket = FormsAuthentication.Decrypt(cookieValue);
//			// Если получити из тикета имя - считаем, что успех
//			if (authTicket != null)
//			{
//				return authTicket.Name;
//			}
//			return null;
//		}

		/// <summary>
		/// Получить информацию о клиенте
		/// </summary>
		/// <param name="appName">Имя текущего приложения</param>
		/// <returns></returns>
		public static string GetUserInfo(string appName)
		{
			return string.Empty;
			// TODO:Get user info
//			if (HttpContext.Current == null)
//			{
//				return string.Empty;
//			}
//			var request = HttpContext.Current.Request;
//			
//			var sb = new StringBuilder();
//			appendFormat(sb, "ClientName", appName);
//
//			appendFormat(sb, "WebServerHost", request.Url.Host);
//			appendFormat(sb, "WebServerPort", request.Url.Port);
//			appendFormat(sb, "WebServerProtocol", request.Url.Scheme);
//
//			appendFormat(sb, "ClientIP", GetUserIP());
//			if (!string.IsNullOrEmpty(request.UserAgent))
//			{
//				var parser = Parser.GetDefault();
//				var clientInfo = parser.Parse(request.UserAgent);
//				appendFormat(sb, "ClientBrowser", clientInfo.UserAgent);
//				appendFormat(sb, "ClientOS", clientInfo.OS);
//				if (clientInfo.Device.Family != "Other")
//				{
//					appendFormat(sb, "ClientDevice", clientInfo.Device);
//				}
//			}
//			appendFormat(sb, "UserAgent", request.UserAgent ?? "Non browser (from code)");
//			return sb.ToString();
		}

		private static void appendFormat(StringBuilder sb, string key, object value)
		{
			sb.AppendFormat("{0}= {1}", Text.PadRight(key, 20), Text.Convert(value));
			sb.AppendLine();
		}

		private const string _localHost = "::1";
		
		/// <summary>
		/// Получить IP пользователя
		/// </summary>
		/// <returns></returns>
		public static string GetUserIP(bool hex = false)
		{
			return string.Empty;
			//TODO: get User ip
//			if (HttpContext.Current == null)
//			{
//				return string.Empty;
//			}
//			string xForwardedFor = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
//			string remoteAddr = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
//			var ip = string.IsNullOrWhiteSpace(xForwardedFor) ? remoteAddr : xForwardedFor;
//
//			IPAddress ipVSix;
//			if (ip != _localHost && IPAddress.TryParse(ip, out ipVSix))
//			{
//				if (ipVSix.AddressFamily == AddressFamily.InterNetworkV6)
//				{
//					ip = "255.255.255.255";
//				}
//			}
//
//			if (string.IsNullOrEmpty(ip))
//			{
//				ip = "0.0.0.0";
//			}
//			if (ip.Contains(","))
//			{
//				ip = Text.Split(ip)[0].Trim();
//			}
//			if (ip != _localHost && ip.Contains(":"))
//			{
//				ip = Text.Split(ip, ':')[0].Trim();
//			}
//			ip = ip == _localHost ? "127.0.0.1" : ip;
//
//			if (hex)
//			{
//				var address = IPAddress.Parse(ip);
//				var bytes = address.GetAddressBytes();
//				return bytes.Aggregate("", (current, b) => current + b.ToString("X2"));
//			}
//			return ip;
		}

		public static bool VerifyFileWithAV(string path)
		{
			for(var i = 0; i < 10; i++)
			{
				try
				{
					using (var fs = new FileStream(path, FileMode.Open))
					{
						fs.ReadByte();
					}
					System.Threading.Thread.Sleep(10);
				}
				catch (IOException)
				{
					return false;
				}
				catch (UnauthorizedAccessException)
				{
					return false;
				}
			}
			return true;
		}

//		public static string GetAuthGetParams(string encryptedTicket)
//		{
//			var getParamVal = Crypt.Encrypt(encryptedTicket + Text.Convert(DateTime.Now, Text.DateTimeView.TimeStamp), string.Empty);
//			return string.Format("{0}={1}", AuthCookieGetParamName, HttpUtility.UrlEncode(getParamVal));
//		}
	}
}