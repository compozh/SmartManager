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
using Web.Authentification;

namespace Web.Authentification
{
	[Route("api/[controller]")]
	public class AccountController : Controller
	{
		private IIdentityProvider _identityProvider;
		private readonly IAuthOptions _options;

		public AccountController(IIdentityProvider identityProvider, IAuthOptions options)
		{
			_identityProvider = identityProvider;
			_options = options;
		}

		[HttpPost("[action]")]
		public async Task Login([FromBody]AuthData user)
		{
			var identity = await _identityProvider.GetIdentity(user.Login, user.Password);
			if (identity == null)
			{
				Response.StatusCode = 400;
				await Response.WriteAsync("Invalid username or password.");
				return;
			}
			
			var now = DateTime.UtcNow;
			// создаем JWT-токен
			var jwt = new JwtSecurityToken(
				issuer: _options.Issuer,
				audience: _options.Audience,
				notBefore: now,
				claims: identity.Claims,
				expires: now.Add(TimeSpan.FromMinutes(_options.Lifetime)),
				signingCredentials: new SigningCredentials(_options.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
			var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

			var response = new {
				access_token = encodedJwt,
				username = identity.Name
			};

			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
		}


	}


	public class AuthData
	{
		public string Login { get; set; }
		public string Password { get; set; }
	}
}
