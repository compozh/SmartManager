using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Web.Authentication;
using Web.Tools;
using HttpContext = Microsoft.AspNetCore.Http.HttpContext;

namespace AuthenticationMiddleware
{
	public class Authentication
	{
		private readonly RequestDelegate _next;
		private readonly AuthenticationSettings _settings;
		private readonly AuthenticationTools _auth;
		private readonly IConfiguration _config;

		private string _loginSegment => new PathString(_settings.Path).Add("/login");
		private string _logoutSegment => new PathString(_settings.Path).Add("/logout");
		private string _currentUserSegment => new PathString(_settings.Path).Add("/user");

		
		public Authentication(RequestDelegate next, AuthenticationSettings settings, AuthenticationTools auth, IConfiguration config)
		{
			_next = next;
			_settings = settings;
			_auth = auth;
			_config = config;
		}
		
		public async Task Invoke(HttpContext context)
		{
			
			// Пропускаем не POST запросы
			if (!string.Equals(context.Request.Method, "POST", StringComparison.OrdinalIgnoreCase))
			{
				await _next(context);
				return;
			}

			// Login 
			if (context.Request.Path.StartsWithSegments(_loginSegment))
			{
				await loginAsync(context);
				return;
			}
			
			// Logout
			if (context.Request.Path.StartsWithSegments(_logoutSegment))
			{
				logout(context);
				return;
			}
			// Get Curren tUser
			if (context.Request.Path.StartsWithSegments(_currentUserSegment))
			{
				await getCurrentUser(context);
				return;
			}
			await _next(context);
			
		}

		private async Task getCurrentUser(HttpContext context)
		{
			if (context.User.Identity.IsAuthenticated)
			{
				var userData = _auth.CurrentUser;

				if (!string.IsNullOrEmpty(userData.UserPhoto))
				{
					var webServiceUrl = _config.GetSection("AppSettings").GetValue<string>("WebServiceUrl");
					var requestUrl = "/GetFile.ashx?file=";
					var hash = userData.UserPhoto;
					var additionalUrlParams = "&folder=content&nodownload=1";
					userData.UserPhoto = webServiceUrl + requestUrl + hash + additionalUrlParams;
				}
				
				var userInJson = JsonConvert.SerializeObject(userData);
			
				await context.Response.WriteAsync(userInJson);
				return;
			}
		}

		private void logout(HttpContext context)
		{
			// TODO: LOGOUT
			//_auth.Login()
		}
		
		private async Task loginAsync(HttpContext context)
		{
			var user = deserialize<AuthData>(context.Request.Body);
			var response = _auth.Login(user);
			if (!response.Result)
			{
				context.Response.StatusCode = 400;
				await context.Response.WriteAsync(response.Message);
				return;
			}

			// Сериализация ответа
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