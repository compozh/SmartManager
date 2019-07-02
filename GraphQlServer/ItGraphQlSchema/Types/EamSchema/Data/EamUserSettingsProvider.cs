using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.EamSchema
{
	public interface IEamUserSettingsProvider
	{
		Task<EamUserSettings> GetCurrentSettings();
	}

	[AddInDI(typeof(IEamUserSettingsProvider))]
	internal class EamUserSettingsProvider : IEamUserSettingsProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		private readonly IMemoryCache _cache;
		private readonly IHttpContextAccessor _httpContextAccessor;

		private static readonly TimeSpan CacheExpiration = new TimeSpan(1, 0, 0);

		public EamUserSettingsProvider(WebRequestsTools webRequestsTools, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
		{
			_webRequestsTools = webRequestsTools;
			_cache = cache;
			_httpContextAccessor = httpContextAccessor;
		}
		
		public async Task<EamUserSettings> GetCurrentSettings()
		{
			var context = _httpContextAccessor.HttpContext;
			var userId = context.User.Identity.Name;
			var userSettings = _cache.Get<EamUserSettings>(userId);
			if (userSettings != null)
			{
				return userSettings;
			}

			userSettings = await getSettings();
			_cache.Set(userId, userSettings, CacheExpiration);
			return userSettings;
		}
		
		private async Task<EamUserSettings> getSettings()
		{
			var calcId = "_EAM.USERSETTINGS";
			var args = string.Empty;
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<EamUserSettings>(requestResult.Content);
			}
		}
	}
}