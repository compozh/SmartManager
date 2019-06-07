using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Web.Authentication;

namespace AuthenticationMiddleware
{
	public class Authentication
	{
		private readonly RequestDelegate _next;
		private readonly AuthenticationSettings _settings;
		private readonly AuthenticationTools _auth;

		private string _loginSegment => new PathString(_settings.Path).Add("/login");
		private string _logoutSegment => new PathString(_settings.Path).Add("/logout");
		private string _currentUserSegment => new PathString(_settings.Path).Add("/user");

		
		public Authentication(RequestDelegate next, AuthenticationSettings settings, AuthenticationTools auth)
		{
			_next = next;
			_settings = settings;
			_auth = auth;
		}
		
		public async Task Invoke(HttpContext context)
		{
			
			// ���������� �� POST �������
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
				var name = context.User.Identity.Name??string.Empty;
				var userData = new UserData();

				userData.Name = name;
				userData.Login = name;
				userData.Id = "U20810";
				userData.Image = "";
				userData.DelegatedRights = new List<DelegatedRights>();
				userData.DelegatedRights.Add(new DelegatedRights()
				{
					Name = "Делегированные права пользователя 1",
					Id = "U20811",
					isActive = false
				});
				userData.DelegatedRights.Add(new DelegatedRights()
				{
					Name = "Делегированные права пользователя 2",
					Id = "U20812",
					isActive = true
				});
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

			// ������������ ������
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