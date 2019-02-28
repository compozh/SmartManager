using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Web.Tools;
using HttpContext = Web.Tools.HttpContext;

namespace Web.Authentication
{
	public class AuthenticationTools
	{
		private readonly IIdentityProvider _identityProvider;
		private readonly IAuthOptions _options;

		public AuthenticationTools(IIdentityProvider identityProvider, IAuthOptions options)
		{
			_identityProvider = identityProvider;
			_options = options;
		}

		/// <summary>
		/// Повторный вход, если срок жизни токена вышел
		/// </summary>
		/// <param name="context"></param>
		/// <returns></returns>
		public AuthResult LoginByToken(){
			
			var result = _identityProvider.LoginByToken();

			if (result.Success)
			{
				return new AuthResult { Result = true};				
			}
			return new AuthResult { Result = false, Message = "Authorization header not found" };
		}

		
		/// <summary>
		/// Вход в It-Enterprise
		/// </summary>
		/// <param name="userAuth"></param>
		/// <returns></returns>
		public AuthResult Login(AuthData userAuth)
		{
			
			var user = _identityProvider.Login(userAuth.Login, userAuth.Password, out IEnumerable<Claim> claims);
			
			if (user == null || !user.Success)
			{
				return new AuthResult{ Result = false, Message = "Invalid username or password."};
			}

			SessionHandler.Current.SetCurrentUser(user);

			var identity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

			var now = DateTime.UtcNow;
			var expires = now.Add(TimeSpan.FromMinutes(_options.Lifetime));
			if (userAuth.RememberMe)
			{
				expires = expires.Add(TimeSpan.FromDays(365));
			}
			
			// создаем JWT-токен
			var jwt = new JwtSecurityToken(
				_options.Issuer,
				_options.Audience,
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
