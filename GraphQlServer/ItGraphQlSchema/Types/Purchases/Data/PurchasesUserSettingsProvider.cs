using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.Purchases
{
	public interface IPurchasesUserSettingsProvider
	{
		Task<PurchasesUserSettings> GetCurrentSettings();
	}

	[AddInDI(typeof(IPurchasesUserSettingsProvider))]
	class PurchasesUserSettingsProvider : IPurchasesUserSettingsProvider
	{

		private readonly WebRequestsTools _webRequestsTools;
		private readonly IMemoryCache _cache;
		private readonly IHttpContextAccessor _httpContextAccessor;

		public PurchasesUserSettingsProvider(WebRequestsTools webRequestsTools, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
		{
			_webRequestsTools = webRequestsTools;
			_cache = cache;
			_httpContextAccessor = httpContextAccessor;
		}
		public async Task<PurchasesUserSettings> GetCurrentSettings()
		{
			var context = _httpContextAccessor.HttpContext;
			var userId = context.User.Identity.Name;
			var cacheKey = $"purchases-settings:{userId}";
			var userSettings = _cache.Get<PurchasesUserSettings>(cacheKey);
			if (userSettings != null)
			{
				return userSettings;
			}

			userSettings = await getSettings();
			_cache.Set(cacheKey, userSettings);
			return userSettings;
		}

		private async Task<PurchasesUserSettings> getSettings()
		{
			var calcId = "_PURCHASES.USERSETTINGS";
			var args = string.Empty;
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<PurchasesUserSettings>(requestResult.Content);
			}
		}
	}
}
