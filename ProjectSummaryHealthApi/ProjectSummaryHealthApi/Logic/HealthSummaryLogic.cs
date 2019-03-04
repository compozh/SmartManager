using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using SkdLogic.Models;
using Web.WebRequests;

namespace ProjectSummaryHealthApi.Logic
{
	public class HealthSummaryLogic
	{
		public HealthSummaryLogic(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}
		private readonly WebRequestsTools _webRequestsTools;

		public async Task<string> getDetailInformationAsync(string criterion, string date, string parameters)
		{
			string calcId = "GET_PROJECT_HEALTH_DETAILS";
			string args = "{\"CRITERION\":\"" + criterion + "\",\"DATESTR\":\"" + date + "\",\"PARAMETERS\":\"" + parameters + "\" }";

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return requestResult.Content; ;
			}
		}
		public async Task<string> getInfoAboutServerAsync(string date)
		{
			string calcId = "GET_PROJECT_HEALTH_SUMMARY";
			string args = "{\"DATESTR\":\""+date+"\" }";

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
				return null;
				default:
				return requestResult.Content; ;
			}
		}
	}

}
