using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	public class SmartManagerProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		public SmartManagerProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;

		}
		//метод получения всех папок
		public async Task<List<SmartManagerFolder>> GetFoldersAsync()
		{
			var calcId = "SM.GETFOLDERS";
			var args = "{\"STATUS\":\",*\",\"INCONTROL\":0,\"HELPEREXEC\":false,}";
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;

			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<SmartManagerFolder>>(requestResult.Content);
			}
		}
		public async Task<List<SmartManagerTask>> GetTasksAsync(string folderId)
		{
				var calcId = "SM.GETTASKS";
				var temp = folderId.Select(x => new { FolderId = x });
				var args = JsonConvert.SerializeObject(new { STATUS = ",*,?", INCONTROL = 0, FOLDER = folderId??"", HELPEREXEC = false });//(new { Users = temp, ByLogin = false, SaveInContent = true });
			
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<SmartManagerTask>>(requestResult.Content);
			}

		}
		public async Task<SmartManagerTaskGetinfo> GetTasksInfoAsync(int taskId)
		{
			var calcId = "SM.TASK.GETINFO";
			//	var temp = taskId.Select(x => new { taskId = x });
			var args = JsonConvert.SerializeObject(new { ID = taskId });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<SmartManagerTaskGetinfo>(requestResult.Content);

			}
		}
	}
}
