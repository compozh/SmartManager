using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using Shared.DigitalSignature.Middlewares;
using SmartId.Data;

namespace SmartId
{
	public class Program
	{
		public static int Main(string[] args)
		{
			Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Information()
				.MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
				.MinimumLevel.Override("System", LogEventLevel.Warning)
				.MinimumLevel.Override("IdentityServer", LogEventLevel.Information)
				.MinimumLevel.Override("Microsoft.AspNetCore.Authentication", LogEventLevel.Information)
				.Enrich.FromLogContext()
				.WriteTo.RollingFile("Log/smartid-{Date}.log",
					outputTemplate: "[{Timestamp:dd.MM.yy HH:mm:ss} {Level: u3}] [{RequestId}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}",
					fileSizeLimitBytes: 1_000_000,
					shared: true,
					flushToDiskInterval: TimeSpan.FromSeconds(1))
				.CreateLogger();

			try
			{
				Log.Information("Starting host...");
				CreateHostBuilder(args).Build().EnsureSeedData().Run();
				return 0;
			}
			catch (Exception ex)
			{
				Log.Fatal(ex, "Host terminated unexpectedly.");
				return 1;
			}
			finally
			{
				Log.CloseAndFlush();
			}
		}

		public static IHostBuilder CreateHostBuilder(string[] args)
		{
			return Host.CreateDefaultBuilder(args)
				// Загружаем библиотеки ЭЦП
				.LoadIitLibrary()
				.ConfigureAppConfiguration((context, config) =>
				{
					// добавляем опциональный файл настроек приложения для описания апи и клиентов
					config.AddJsonFile("appsettings_apiclients.json", optional: true, reloadOnChange: false);
				})
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
					webBuilder.UseSerilog();
				});
		}
	}
}
