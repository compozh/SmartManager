using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace WebAppBuilderApi
{
    public class HomeController : Controller
	{
		private readonly IConfiguration _configuration;

		public HomeController(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public static readonly string Lock = "lock";
        public void Index()
		{			
				var text = System.IO.File.ReadAllText("./dist/index.html");
				var baseUrl = Url.Content("~");

				if (!baseUrl.EndsWith("/"))
				{
					baseUrl += "/";
				}

				if (!baseUrl.StartsWith("/"))
				{
					baseUrl = "/" + baseUrl;
				}

				text = text.Replace("#GQURL#", _configuration.GetSection("AppSettings")["GraphQlUrl"]);

				text = text.Replace("/#BASE#/", baseUrl);
				HttpContext.Response.ContentType = "text/html";
				HttpContext.Response.WriteAsync(text);

			
        }
    }
}
