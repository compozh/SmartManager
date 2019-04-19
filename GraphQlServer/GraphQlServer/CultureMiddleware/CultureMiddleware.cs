using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;

namespace GraphQlServer.CultureMiddleware
{
	public class CustomerCultureProvider : RequestCultureProvider
	{
		public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
		{
			string cultureCode = null;
			var lang = httpContext.Request.Query["lang"].ToString();
			if (lang == string.Empty && httpContext.Session.Get("lang") != null)
			{
				lang = Encoding.ASCII.GetString(httpContext.Session.Get("lang"));
			}
			else
			{
				httpContext.Session.Set("lang", Encoding.ASCII.GetBytes(lang));
			}
			if (httpContext.Request.Path.HasValue && httpContext.Request.Path.Value.Length >= 4 && httpContext.Request.Path.Value[0] == '/' && httpContext.Request.Path.Value[3] == '/')
			{
				cultureCode = httpContext.Request.Path.Value.Substring(1, 2);
			}
			else
			{
				cultureCode = lang;
			}
			ProviderCultureResult requestCulture = new ProviderCultureResult(cultureCode);

			return Task.FromResult(requestCulture);

		}
	}
}
