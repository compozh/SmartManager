using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace GraphQlServer
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var directory = Directory.GetCurrentDirectory();

			WebHost.CreateDefaultBuilder(args)
				.UseKestrel()
				.UseContentRoot(directory)
				.UseWebRoot(Path.Combine(directory, "public"))
				.UseIISIntegration()
				.UseStartup<Startup>().Build().Run();
		}
			
	}
}
