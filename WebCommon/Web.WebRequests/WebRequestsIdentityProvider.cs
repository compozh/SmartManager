using System.Collections.Generic;
using System.Security.Claims;
using Web.Authentication;
using Web.Tools;

namespace Web.WebRequests
{
	public class WebRequestsIdentityProvider : IIdentityProvider
	{
		private readonly PureWebCalculations _webCalculationsCore;

		public WebRequestsIdentityProvider( PureWebCalculations webCalculationsCore)
		{
			_webCalculationsCore = webCalculationsCore;
		}

		public LoginResult Login(string login, string password, out IEnumerable<Claim> claims)
		{
			var user = _webCalculationsCore.LoginEx(login, password, out claims);
			SessionHandler.Current.SetTicket(user.Ticket);
			SessionHandler.Current.SetCurrentUser(user);

			return user;
		}

		public LoginResult LoginByToken()
		{
			var valueUser = _webCalculationsCore.LoginByToken();			
			SessionHandler.Current.SetTicket(valueUser.Ticket);
			SessionHandler.Current.SetCurrentUser(valueUser);

			return valueUser;
		}
		
	}
	public enum WebRequestsResponseFlags{
		Ok,
		WrongTicket,
		NotAuthorised
	}
	public class WebRequestResult
	{
		public WebRequestsResponseFlags ResultFlag { get; set; }
		public string Content { get; set; }
	}
}