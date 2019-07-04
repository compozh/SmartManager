using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.Common.Data
{
	public interface IAttachmentsProvider
	{
		Task<string> GetAttachmentUrl(Attachment attachment, bool needPdf = false);
		Task<string> GetAttachmentUrl(int id, bool needPdf = false);
		Task<string> GetAttachmentUrl(string alias, string keyValue, int number, bool needPdf = false);
	}
	
	[AddInDI(typeof(IAttachmentsProvider))]
	internal class AttachmentsProvider: IAttachmentsProvider
	{
		private readonly WebRequestsTools _webRequestsTools;
		private readonly IConfiguration _config;
		private readonly IMemoryCache _cache;
		private string _baseUrl;
		private const string CalcId = "GETATTACHMENTEX";
		private const string ByAliasCalcId = "GETATTACHMENT";

		private string BaseUrl
		{
			get
			{
				if (!string.IsNullOrEmpty(_baseUrl))
				{
					return _baseUrl;
				}

				var webServiceUrl = _config.GetSection("AppSettings").GetValue<string>("WebServiceUrl");
				var baseUrl =
					$"{webServiceUrl}{('/'.Equals(webServiceUrl[webServiceUrl.Length - 1]) ? string.Empty : "/")}GetFile.ashx?file=";
				_baseUrl = baseUrl;
				return baseUrl;
			}
		}

		public AttachmentsProvider(WebRequestsTools webRequestsTools, IConfiguration config, IMemoryCache cache)
		{
			_webRequestsTools = webRequestsTools;
			_config = config;
			_cache = cache;
		}
		
		public async Task<string> GetAttachmentUrl(Attachment attachment, bool needPdf = false)
		{
			if (attachment == null)
			{
				return null;
			}
			
			return await GetAttachmentUrl(attachment.Id, needPdf);
		}

		public async Task<string> GetAttachmentUrl(int id, bool needPdf = false)
		{
			var cacheKey = $"attachment:{id}";
			var attachmentUrl = _cache.Get<string>(cacheKey);
			if (!string.IsNullOrEmpty(attachmentUrl) && RemoteFileExists(attachmentUrl))
			{
				return attachmentUrl;
			}
			
			var args = JsonConvert.SerializeObject(new { ID = id, PDF = needPdf });
			var result = await _webRequestsTools.CallWebRequestAsync(CalcId, args);
			var attachmentInfo = JsonConvert.DeserializeObject<GetAttachmentsResult>(result.Content);
			attachmentUrl = $"{BaseUrl}{attachmentInfo.FileName}";
			_cache.Set(cacheKey, attachmentUrl);
			return attachmentUrl;
		}

		public async Task<string> GetAttachmentUrl(string alias, string keyValue, int number, bool needPdf = false)
		{
			var cacheKey = $"attachment:{alias}{keyValue}{number}";
			var attachmentUrl = _cache.Get<string>(cacheKey);
			if (!string.IsNullOrEmpty(attachmentUrl) && RemoteFileExists(attachmentUrl))
			{
				return attachmentUrl;
			}
			
			var args = JsonConvert.SerializeObject(new { TABLE = alias, KEYVALUE = keyValue, NDOR = number, PDF = needPdf });
			var result = await _webRequestsTools.CallWebRequestAsync(ByAliasCalcId, args);
			var attachmentInfo = JsonConvert.DeserializeObject<GetAttachmentsResult>(result.Content);
			attachmentUrl = $"{BaseUrl}{attachmentInfo.FileName}";
			_cache.Set(cacheKey, attachmentUrl);
			return attachmentUrl;
		}

		private static bool RemoteFileExists(string url)
		{
			try
			{
				var request = WebRequest.Create(url) as HttpWebRequest;
				request.Method = "HEAD";
				using (var response = request.GetResponse() as HttpWebResponse)
				{
					return response.StatusCode == HttpStatusCode.OK;
				}
			}
			catch
			{
				return false;
			}
		}
		
		private class GetAttachmentsResult
		{
			public string FileName { get; set; }
			public string FileType { get; set; }
			public int Id { get; set; }
		}
	}
}