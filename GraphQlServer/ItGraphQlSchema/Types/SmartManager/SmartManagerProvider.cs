using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ItGraphQlSchema.Types.SmartManager.Model;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AddInDIAttribute]
	public class SmartManagerProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		private readonly IConfiguration _config;
		private string _cache;

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
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args); //достаю объект из IServiceProvider
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
			var args = JsonConvert.SerializeObject(new { STATUS = ",*,?", INCONTROL = 0, FOLDER = folderId ?? "", HELPEREXEC = false });

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args); //достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:

					// Получение ссылки на файл 
					var webServiceUrl = getWebServiceUrl();

					var tasks = JsonConvert.DeserializeObject<List<SmartManagerTask>>(requestResult.Content);
					foreach (var tas in tasks)
					{
						if (string.IsNullOrEmpty(tas.AddedPhoto))
						{
							continue;
						}

						tas.AddedPhoto = webServiceUrl + tas.AddedPhoto + "&folder=content&nodownload=1";
					}

					return tasks;
			}
		}

		public async Task<SmartManagerTaskFullInfo> GetTasksInfoAsync(int taskId)
		{
			var calcId = "SM.TASK.GETINFO";
			var smFullINfo = new SmartManagerTaskFullInfo();
			var args = JsonConvert.SerializeObject(new { ID = taskId });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args); //достаю объект из IServiceProvider
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
			var webServiceUrl = getWebServiceUrl();

			calcId = "GETATTACHMENTEX";

			foreach (var doc in smFullINfo.Originals)
			{
				var convertToPdf = getNeedConvertToPdf(doc.FileExt);
				
				args = JsonConvert.SerializeObject(new { ID = doc.Id, PDF = convertToPdf });
				var result = await _webRequestsTools.CallWebRequestAsync(calcId, args);
				var smFile = JsonConvert.DeserializeObject<SmFile>(result.Content);
				var fileName = smFile.Pdf ? smFile.FileName.Replace(doc.FileExt, "pdf") : smFile.FileName;
				doc.FileUrl = webServiceUrl + fileName;
			}

			if (string.IsNullOrEmpty(smFullINfo.AddedPhoto))
			{
				return smFullINfo;
			}

			var filePhoto = smFullINfo.AddedPhoto;
			smFullINfo.AddedPhoto = webServiceUrl + filePhoto + "&folder=content&nodownload=1";

			return smFullINfo;
		}

		private string getWebServiceUrl()
		{
			if (!string.IsNullOrEmpty(_cache))
			{
				return _cache;
			}

			const char slash = '/';
			const string strFile = "GetFile.ashx?file=";
			var webServiceUrl = _config.GetSection("AppSettings").GetValue<string>("WebServiceUrl");
			if (Equals(webServiceUrl[webServiceUrl.Length - 1], slash))
			{
				webServiceUrl += strFile;
			}
			else
			{
				webServiceUrl += slash + strFile;
			}

			_cache = webServiceUrl;
			return webServiceUrl;
		}

		private bool getNeedConvertToPdf(string fileExtension)
		{
			string[] extensionsForConvert = { "doc", "docx", "rtf", "xls", "xlsx", "ppt", "pptx" };
			return extensionsForConvert.Any(t => t.Equals(fileExtension, StringComparison.InvariantCultureIgnoreCase));
		}
	}
}