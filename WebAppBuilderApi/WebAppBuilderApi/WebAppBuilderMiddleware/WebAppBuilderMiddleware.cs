using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Web.WebRequests;

namespace WebAppBuilderApi.WebAppBuilderMiddleware
{
	public class WebAppBuilderMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly WebAppBuilderSettings _settings;
		private readonly WebRequestsTools _webRequestsTools;

		public WebAppBuilderMiddleware(RequestDelegate next, WebAppBuilderSettings settings,WebRequestsTools webRequestsTools )
		{
			_next = next;
			_settings = settings;
			_webRequestsTools = webRequestsTools;
		}

		public async Task Invoke(HttpContext context)
		{

			if (!isWebAppBuilderRequest(context))
			{
				await _next(context);
				return;
			}
			

			await executeAsync(context);
		}

		private bool isWebAppBuilderRequest(HttpContext context)
		{
			return context.Request.Path.StartsWithSegments(_settings.Path)
					&& string.Equals(context.Request.Method, "POST", StringComparison.OrdinalIgnoreCase);
		}

		private async Task executeAsync(HttpContext context)
		{
			
			var applicationRequestArgs = deserialize<VAppRequestArguments>(context.Request.Body);
			var calcId = "GETVAPP";
			var args = JsonConvert.SerializeObject(new { applicationRequestArgs.ApplicationId });
			
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args, true);
			var requestResult = await task;
			
			string result = null; 
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.Ok:
					result = requestResult.Content;
					break;

			}
			await context.Response.WriteAsync(result);
		}
		
		private T deserialize<T>(Stream s)
		{
			using (var reader = new StreamReader(s))
			using (var jsonReader = new JsonTextReader(reader))
			{
				var ser = new JsonSerializer();
				return ser.Deserialize<T>(jsonReader);
			}
		}
	}

	public class VAppRequestArguments
	{
		public string ApplicationId { get; set; } 
	}
}