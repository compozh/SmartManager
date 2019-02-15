using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

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

		/// <summary>
		/// Вход в It-Enterprise
		/// </summary>
		/// <param name="userAuth"></param>
		/// <returns></returns>
		public async Task<AuthResult> Login(AuthData userAuth)
		{
			var user = await _identityProvider.GetUser(userAuth.Login, userAuth.Password);
			
			if (user == null || !user.Success)
			{
				return new AuthResult{ Result = false, Message = "Invalid username or password."};
			}

			var claims = new List<Claim> {
				new Claim(ClaimsIdentity.DefaultNameClaimType, userAuth.Login),
			};
			var identity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
		
			claims = identity.Claims.ToList();
			claims.Add(new Claim("auth", JsonConvert.SerializeObject(userAuth)));
			
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

			return new AuthResult { Result = true, Message = stringResponse, UserInfo = user};
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
		public User UserInfo { get; set; }
		public string Message { get; set; }
		public bool Result { get; set; }
	}
}
