using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Web.Authentication
{
	public class AuthenticationTools
	{
		private IIdentityProvider _identityProvider;
		private readonly IAuthOptions _options;

		public AuthenticationTools(IIdentityProvider identityProvider, IAuthOptions options)
		{
			_identityProvider = identityProvider;
			_options = options;
		}

		public async Task<AuthResult> ReLogin(HttpContext context)
		{
			var header = context.Request.Headers["Authorization"];
			var tokenString = header[0].Substring(7);
			var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
			var claim = token.Claims.FirstOrDefault(c => c.Type == "auth");

			if (claim != null)
			{
				var authData = JsonConvert.DeserializeObject<AuthData>(claim.Value);
				return await Login(authData);
			}

			return new AuthResult { Result = false, Message = "Authorization header not found" };
		}
		
		public async Task<AuthResult> Login(AuthData user)
		{
			var identity = await _identityProvider.GetIdentity(user.Login, user.Password);
			
			if (identity == null)
			{
				return new AuthResult{ Result = true, Message = "Invalid username or password."};
			}

			var claims = identity.Claims.ToList();
			claims.Add(new Claim("auth", JsonConvert.SerializeObject(user)));
			
			var now = DateTime.UtcNow;
			var expires = now.Add(TimeSpan.FromMinutes(_options.Lifetime));
			if (user.RememberMe)
			{
				expires = expires.Add(TimeSpan.FromDays(365));
			}
			
			// создаем JWT-токен
			var jwt = new JwtSecurityToken(
				issuer: _options.Issuer,
				audience: _options.Audience,
				notBefore: now,
				claims: claims,
				expires: expires,
				signingCredentials: new SigningCredentials(_options.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
			var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
			var response = new {
				access_token = encodedJwt,
				username = identity.Name
			};
			var stringResponse = JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented });

			return new AuthResult { Result = true, Message = stringResponse};
		}
	}
	public class AuthData
	{
		public string Login { get; set; }
		public string Password { get; set; }
		public bool RememberMe { get; set; }
	}
	public class AuthResult
	{
		public string Message { get; set; }
		public bool Result { get; set; }
	}
}
