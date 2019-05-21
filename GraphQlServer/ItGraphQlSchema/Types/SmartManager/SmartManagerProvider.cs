using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using ItGraphQlSchema.Types.SmartManager.Model;
using Microsoft.Extensions.Configuration;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AddInDIAttribute]
	public class SmartManagerProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		private readonly IConfiguration _config;
		 
		public SmartManagerProvider(WebRequestsTools webRequestsTools, IConfiguration config)
		{
			_webRequestsTools = webRequestsTools;
			_config = config;
		}
		
		// Метод получения всех папок
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
			var args = JsonConvert.SerializeObject(new { STATUS = ",*,?", INCONTROL = 0, FOLDER = folderId??"", HELPEREXEC = false });
			
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
		
		public async Task<SmartManagerTaskFullInfo> GetTasksInfoAsync(int taskId)
		{
			var calcId = "SM.TASK.GETINFO";
			var smFullINfo = new SmartManagerTaskFullInfo();
			var args = JsonConvert.SerializeObject(new { ID = taskId });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					smFullINfo = JsonConvert.DeserializeObject<SmartManagerTaskFullInfo>(requestResult.Content);
				break;
			}
			
			// Получение ссылки на файл 
			const char slash = '/';
			const string strFile = "GetFile.ashx?file=";
			var baseUrl = _config.GetSection("AppSettings").GetValue<string>("WebServiceUrl");
			if (Equals(baseUrl[baseUrl.Length - 1], slash))
			{
				baseUrl += strFile;
			}
			else
			{
				baseUrl += slash+strFile;
			}
			
			calcId = "WFA1ORIG";
			var listFile = new List<object>();
			
			foreach (var orig in smFullINfo.Originals)
			{
				args = JsonConvert.SerializeObject(new { ARSO = smFullINfo.Arso, KEYVALUE = smFullINfo.KeyValue, NDOR = orig.Ndor });
				var result = await _webRequestsTools.CallWebRequestAsync(calcId, args);
				var smFile = JsonConvert.DeserializeObject<SmFile>(result.Content);
				orig.File = baseUrl+smFile.FileName;
				listFile.Add(result);
			}
			
			return smFullINfo;
		}
	}
}

