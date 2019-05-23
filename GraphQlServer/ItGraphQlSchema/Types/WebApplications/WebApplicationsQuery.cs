using System.IO;
using GraphQL.Types;
using Newtonsoft.Json;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.WebApplications
{
	[AddInDI]
	public class WebApplicationsQuery:ObjectGraphType<object>
	{
		private readonly WebRequestsTools _webRequestsTools;

		public WebApplicationsQuery(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
			Field<StringGraphType>("application",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "applicationId", Description = "”никальный идентификатор приложени€" }),
				resolve: getApplicationById);
		}

		private string getApplicationById(ResolveFieldContext<object> context)
		{
			var appId = context.GetArgument<string>("applicationId");
			var calcId = "GETVAPP";
			var args = JsonConvert.SerializeObject(new { ApplicationId = appId });
			
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args, true);
			var requestResult = task.Result;
			
			string result = null; 
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.Ok:
					result = requestResult.Content;
					break;
			}

			return result;
		}
		
	}
}