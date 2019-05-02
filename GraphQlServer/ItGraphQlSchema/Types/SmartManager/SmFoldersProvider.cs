using ItGraphQlSchema.Properties;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Authentication;
using Web.Tools;
using Web.WebRequests;


namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	public class SmFoldersProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		// получение задач не закачено
		public SmFoldersProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}

		//метод получения всех папок
		public async Task<List<SmFolders>> getFoldersAsync()
		{
			var calcId = "SM.GETFOLDERS";
			var args="{\"STATUS\":\",*\",\"INCONTROL\":0,\"HELPEREXEC\":false,}";
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;

			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<SmFolders>>(requestResult.Content);
			}
		}



	}
}
