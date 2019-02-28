using System.Threading.Tasks;
using Web.Authentication;
using Web.Tools;

namespace Web.WebRequests
{
	public class WebRequestsTools
	{
		private readonly PureWebCalculations _webCalculationsCore;
		private readonly IIdentityProvider _identityProvider;
		private const string WRONG_TICKET = "WRONG_TICKET";
		private const string NOT_AUTHORISED = "NOT_AUTHORISED";


		public WebRequestsTools(PureWebCalculations webCalculationsCore,IIdentityProvider identityProvider)
		{
			_webCalculationsCore = webCalculationsCore;
			_identityProvider = identityProvider;
		}

		//метод на достать другие данные
		public async Task<WebRequestResult> CallWebRequestAsync(string calcId, string args)
		{
			var result = new WebRequestResult();
			var content = await callWebRequestInternalAsync(calcId, args);
			switch (content)
			{
				case WRONG_TICKET:
					result.ResultFlag = WebRequestsResponseFlags.WrongTicket;
					return result;
				case NOT_AUTHORISED:
					result.ResultFlag = WebRequestsResponseFlags.NotAuthorised;
					return result;
				default:
					result.ResultFlag = WebRequestsResponseFlags.Ok;
					result.Content = content;
					return result;
			}
		}
		
		private async Task<string> callWebRequestInternalAsync(string calcId, string args, bool anonymously = false)
		{
			if (!anonymously && string.IsNullOrEmpty(SessionHandler.Current.GetTicket()))
			{
				var authResult = _identityProvider.LoginByToken();
				if (!authResult.Success)
				{
					return NOT_AUTHORISED;
				}
			}

			var result = await _webCalculationsCore.ExecuteExAsync(calcId, args, anonymously ? null : SessionHandler.Current.GetTicket());
			if (result == PureWebCalculations.WrongTicketResult)
			{
				var authResult = _identityProvider.LoginByToken();
				if (!authResult.Success)
				{
					return WRONG_TICKET;
				}
				result = await _webCalculationsCore.ExecuteExAsync(calcId, args, anonymously ? null : SessionHandler.Current.GetTicket());
			}

			return result;
		}
	}
}