using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Authentification;
using WebTools;


namespace WebRequests
{
	public class WebRequestsIdentityProvider:IIdentityProvider
	{
		private readonly WebRequestsTools _webRequestsTools;

		public WebRequestsIdentityProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}

		public async Task<ClaimsIdentity> GetIdentity(string username, string password)
		{
			var user = await _webRequestsTools.LoginAsync(username, password);
			if (user == null || !user.Success)
			{
				return null;
			}

			var claims = new List<Claim> {
				new Claim(ClaimsIdentity.DefaultNameClaimType, username)
			};
			return new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
		}
	}
}