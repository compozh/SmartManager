using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebAppBuilderApi
{
	public class Program
	{
		public static void Main(string[] args)
		{

			CreateWebHostBuilder(args).Build().Run();
		}
		// все приложение и компоненты переведено на фрэймворк 2.2.0 
		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseStartup<Startup>();
	}
}
