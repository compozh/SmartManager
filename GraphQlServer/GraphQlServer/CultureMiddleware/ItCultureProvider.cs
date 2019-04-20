using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http.Extensions;

namespace GraphQlServer.CultureMiddleware
{
	public class ItCultureProvider : RequestCultureProvider
	{
		public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
		{
			var t = httpContext.Request.Query["lang"];
			var lang = httpContext.Request.Query["lang"].ToString();
			if (!lang.Equals(string.Empty))
			{
				httpContext.Session.SetString(lang, lang);
			}
			else if(lang.Equals(string.Empty) && httpContext.Request.Cookies["c"]!=null)
			{
				lang = httpContext.Request.Cookies["c"];
			}
			else if (lang.Equals(string.Empty) && httpContext.Session.GetString(lang) != null)
			{
				lang = httpContext.Session.GetString(lang);
			}
			httpContext.Response.Cookies.Append("c",lang);

			return Task.FromResult(new ProviderCultureResult(lang));
		}
	}
}
