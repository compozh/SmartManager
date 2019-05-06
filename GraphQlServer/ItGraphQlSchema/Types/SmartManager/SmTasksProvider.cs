using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.SmartManager
{
	public class SmTaskInfo
	{
		//[JsonProperty("PHOTO")]
		//public string Photo { get; set; }
		[JsonProperty("USERID")]
		public string UserID { get; set; }
	}
	[AtributeAddInDI]
	public class SmTasksProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		public SmTasksProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;

		}

		public async Task<List<SmTasks>> GetTasksAsync(string folderId)
		{
			if (String.IsNullOrEmpty(folderId))
			{
				var calcId = "SM.GETTASKS";

				var args ="{\"STATUS\":\",*,?\", \"INCONTROL\":0, \"FOLDER\":\"\", \"HELPEREXEC\":false,}";
			//	var args = "{\"STATUS\":\",*\",\"INCONTROL\":0,\"HELPEREXEC\":false,}";
				var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
				var requestResult = await task;

				switch (requestResult.ResultFlag)
				{
					case WebRequestsResponseFlags.WrongTicket:
					case WebRequestsResponseFlags.NotAuthorised:
						return null;
					default:
						return JsonConvert.DeserializeObject<List<SmTasks>>(requestResult.Content);
				}

			}
			else
			{
				var calcId = "SM.GETTASKS";
				var temp = folderId.Select(x => new { FolderId = x });
				var args = JsonConvert.SerializeObject(new { STATUS = ",*,?", INCONTROL = 0, FOLDER = folderId, HELPEREXEC = false });//(new { Users = temp, ByLogin = false, SaveInContent = true });
				var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
				var requestResult = await task;
				switch (requestResult.ResultFlag)
				{
					case WebRequestsResponseFlags.WrongTicket:
					case WebRequestsResponseFlags.NotAuthorised:
						return null;
					default:
						return JsonConvert.DeserializeObject<List<SmTasks>>(requestResult.Content);

				}
			}
			
		}
		public async Task<SmTaskGetinfo> GetTasksInfoAsync(int taskId)
		{
			var calcId = "SM.TASK.GETINFO";
		//	var temp = taskId.Select(x => new { taskId = x });
			var args = JsonConvert.SerializeObject(new { ID = taskId });//(new { Users = temp, ByLogin = false, SaveInContent = true });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<SmTaskGetinfo>(requestResult.Content);

			}
		}
	}
}
