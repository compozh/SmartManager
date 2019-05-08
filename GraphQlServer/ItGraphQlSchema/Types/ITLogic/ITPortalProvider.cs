using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITPortalProvider
	{
		private readonly WebRequestsTools _webRequest;

		public ITPortalProvider(WebRequestsTools webRequest)
		{
			_webRequest = webRequest;
		}
		/// <summary>
		/// Получение меню, и раздела первого по списку меню
		/// </summary>
		/// <param name="anonymousСall"> Анонимность вызова</param>
		/// <returns></returns>
		public async Task<Dictionary<string, object>> GetFavoriteMenu(bool anonymousСall)
		{
			var args = "";

			try
			{
				var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL", args, false);
				return JsonConvert.DeserializeObject<Dictionary<string, object>>(responseFromWeb.Content);
			}
			catch (Exception e)
			{
				return new Dictionary<string, object>();
			}
		}

		/// <summary>
		/// Получение всех разделов по выбранному пункту меню
		/// </summary>
		/// <param name="folderCode"> Код папки</param>
		/// <param name="anonymousСall"> Анонимность вызова</param>
		/// <returns></returns>
		public async Task<Dictionary<string, object>> GetFavoriteForFolder(string folderCode,bool anonymousСall)
		{
			folderCode = "MP.NORM";
			var args = "{\"FOLDERCODE\":\"" + folderCode + "\"}";

			try
			{
				var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTALFOLDER", args, false);
				return JsonConvert.DeserializeObject<Dictionary<string, object>>(responseFromWeb.Content);
			}
			catch (Exception e)
			{
				return new Dictionary<string, object>();
			}
		}
	}
}
