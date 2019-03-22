using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Web.Authentication;

namespace GraphQlServer.Authentication
{
	public class AuthenticationMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly AuthenticationSettings _settings;
		private readonly AuthenticationTools _auth;

		public AuthenticationMiddleware(RequestDelegate next, AuthenticationSettings settings, AuthenticationTools auth)
		{
			_next = next;
			_settings = settings;
			_auth = auth;
		}
		
		public async Task Invoke(HttpContext context)
		{

			if (!isAuthenticationRequest(context))
			{
				await _next(context);
				return;
			}

			await executeAsync(context);
		}
		
		private bool isAuthenticationRequest(HttpContext context)
		{
			return context.Request.Path.StartsWithSegments(_settings.Path)
					&& string.Equals(context.Request.Method, "POST", StringComparison.OrdinalIgnoreCase);
		}
		
		private async Task executeAsync(HttpContext context)
		{
			var user = deserialize<AuthData>(context.Request.Body);
			var response = _auth.Login(user);
			if (!response.Result)
			{
				context.Response.StatusCode = 400;
				await context.Response.WriteAsync(response.Message);
				return;
			}

			// сериализация ответа
			context.Response.ContentType = "application/json";
			await context.Response.WriteAsync(response.Message);
		
			
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
}