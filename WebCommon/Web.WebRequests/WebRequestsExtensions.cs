using Microsoft.AspNetCore.Http;
using Web.Tools;

namespace Web.WebRequests
{
	public static class WebRequestsExtensions
	{
		public static string GetTicket(this ISession current)
		{
			return current.Get<string>("Ticket");
		}

		public static void SetTicket(this ISession current, string ticket)
		{
			current.Set("Ticket",ticket);
		}
		
	}
}