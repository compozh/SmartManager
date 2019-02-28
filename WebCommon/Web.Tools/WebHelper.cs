using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Web.Tools
{

	public static class HttpContextAccessorHandler
	{
		public static void Configure(IHttpContextAccessor httpContextAccessor)
		{
			SessionHandler.Configure(httpContextAccessor);
			HttpContext.Configure(httpContextAccessor);
		}
	}
	public static class SessionHandler
	{
		private static IHttpContextAccessor _httpContextAccessor;

		internal static void Configure(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public static ISession Current => _httpContextAccessor.HttpContext.Session;
	}
	
	public static class HttpContext
	{
		private static IHttpContextAccessor _httpContextAccessor;

		internal static void Configure(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public static Microsoft.AspNetCore.Http.HttpContext Current => _httpContextAccessor.HttpContext;
	}
	
	public static class SessionExtensions
	{
		public static void Set<T>(this ISession session, string key, T value)
		{
			session.Set(key, Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(value)));
		}

		public static T Get<T>(this ISession session, string key)
		{
			if (!session.TryGetValue(key, out var result))
			{
				return default(T);
			}
			var value = Encoding.ASCII.GetString(result);
			return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
		}
	}

	
}