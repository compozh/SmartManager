using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ItGraphQlSchema.Types.ITLogic.Model;
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
		public async Task<ITMenuItems> GetMenu()
		{
			var args = "";

			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENU", args);
			return JsonConvert.DeserializeObject<ITMenuItems>(responseFromWeb.Content);
		}

		/// <summary>
		/// Получение всех разделов по выбранному пункту меню
		/// </summary>
		/// <param name="folderCode"> Код модуля</param>
		/// <returns></returns>
		public async Task<MenuModule> GetModuleContent(string moduleCode)
		{
			moduleCode = "MP.NORM";
			var args = "{\"MODULECODE\":\"" + moduleCode + "\"}";

			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENUMODULE", args);
			return JsonConvert.DeserializeObject<MenuModule>(responseFromWeb.Content);
		}
	}
}
