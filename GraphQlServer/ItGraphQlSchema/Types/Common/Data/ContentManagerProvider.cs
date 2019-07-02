using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.Common.Data
{
	public interface IContentManagerProvider
	{
		Task<List<string>> GetContentFiles(string table, string id);
	}

	[AddInDI(typeof(IContentManagerProvider))]
	class ContentManagerProvider : IContentManagerProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		private readonly IMemoryCache _cache;

		public ContentManagerProvider(WebRequestsTools webRequestsTools, IMemoryCache cache)
		{
			_webRequestsTools = webRequestsTools;
			_cache = cache;
		}

		public async Task<List<string>> GetContentFiles(string table, string id)
		{
			var userSettings = _cache.Get<List<string>>(id);
			if (userSettings != null)
			{
				return userSettings;
			}

			userSettings = await getFiles(table, id);
			_cache.Set(id, userSettings);
			return userSettings;
		}

		private async Task<List<string>> getFiles(string table, string id)
		{
			var calcId = "_GETCONTENT";
			//var args = $"{{ \"table\" = \"{table}\", \"keyvalue\" = \"{id}\" }}";
			var args = JsonConvert.SerializeObject(new { table, keyvalue = id.TrimEnd() });

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<string>>(requestResult.Content);
			}
		}
	}
}
