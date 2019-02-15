using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Web.Authentication;
using Web.Tools;


namespace Web.WebRequests
{
	public class WebRequestsIdentityProvider:IIdentityProvider
	{
		private readonly WebRequestsTools _webRequestsTools;

		public WebRequestsIdentityProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}


		public async Task<User> GetUser(string login, string password)
		{
			return await _webRequestsTools.LoginAsync(login, password);
		}
	}
}