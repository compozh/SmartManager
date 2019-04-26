using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Web.Tools;
using Web.WebRequests;

namespace ItGraphQlSchema.Types
{
	public class PurchasesProvider : IItAddInSingleton
	{
		public async Task<IEnumerable<CartItem>> GetCartItems()
		{
			return await getCartItemsAsync();
		}

		private readonly WebRequestsTools _webRequestsTools;

		public PurchasesProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}

		private async Task<List<CartItem>> getCartItemsAsync()
		{
			var calcId = "_SMART.PURCHASES.GETCARTROWS";
			var args = "";

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<CartItem>>(requestResult.Content);

			}
		}
	}
}
