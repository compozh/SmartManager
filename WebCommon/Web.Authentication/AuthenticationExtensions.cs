using Microsoft.AspNetCore.Http;
using Web.Tools;

namespace Web.Authentication
{
	public static class AuthenticationExtensions
	{
		public static LoginResult GetCurrentUser(this ISession session)
		{
			return session.Get<LoginResult>("CurrentUser");
		}
		
		public static void SetCurrentUser(this ISession session, LoginResult currentUser)
		{
			session.Set("CurrentUser", currentUser);
		}
		
	}
}