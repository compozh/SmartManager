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
		/// <returns></returns>
		public async Task<ITMenu> GetMenu()
		{
			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENU", string.Empty);
			return JsonConvert.DeserializeObject<ITMenu>(responseFromWeb.Content);
		}

		/// <summary>
		/// Получение всех разделов по выбранному пункту меню
		/// </summary>
		/// <param name="moduleCode"> Код модуля</param>
		/// <returns></returns>
		public async Task<MenuModule> GetModuleContent(string moduleCode)
		{
			// Временно, для теста
			moduleCode = "MP.NORM";
			var args = $"{{\"MODULECODE\":\"{moduleCode}\"}}";

			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENUMODULE", args);
			return JsonConvert.DeserializeObject<MenuModule>(responseFromWeb.Content);
		}
	}
}
