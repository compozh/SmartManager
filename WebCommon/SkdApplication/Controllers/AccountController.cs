using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Web.Authentication;

namespace Web.Authentication
{

	[Route("api/[controller]")]
	public class AccountController : Controller
	{
		private AuthenticationTools _auth;

		public AccountController(AuthenticationTools auth)
		{
			_auth = auth;
		}
		

		[HttpPost("[action]")]
		public async Task Login([FromBody]AuthData user)
		{
			var response = await _auth.Login(user);

			if (!response.Result)
			{
				Response.StatusCode = 400;
				await Response.WriteAsync(response.Message);
				return;
			}
			
			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(response.Message);
		}


	}

	
}
