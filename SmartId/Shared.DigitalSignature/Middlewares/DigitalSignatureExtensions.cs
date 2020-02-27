using DotNetCore2;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System;
using System.IO;
using System.Reflection;

namespace Shared.DigitalSignature
{
	public static class DigitalSignatureExtensions
	{
		public static IApplicationBuilder UseDigitalSignature(this IApplicationBuilder builder)
		{
			var digitalSignatureAssempbly = typeof(DigitalSignatureExtensions).GetTypeInfo().Assembly;
			builder.UseStaticFiles(new StaticFileOptions()
			{
				FileProvider = new EmbeddedFileProvider(digitalSignatureAssempbly, "Shared.DigitalSignature.wwwroot.js.eds"),
				RequestPath = new PathString("/js/eds")
			});
			builder.UseStaticFiles(new StaticFileOptions()
			{
				FileProvider = new PhysicalFileProvider(Path.Combine(Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().Location).LocalPath), "Data")),
				RequestPath = "/Data"
			});
			builder.UseProxyHandlerMiddleware();
			return builder;
		}

		public static IServiceCollection AddDigitalSignature(this IServiceCollection services)
		{
			var digitalSignatureAssempbly = typeof(DigitalSignatureExtensions).GetTypeInfo().Assembly;
			// Подключаем представления из сборки КЭЦП
			services.Configure<MvcRazorRuntimeCompilationOptions>(options =>
			{
				options.FileProviders.Add(
					new EmbeddedFileProvider(digitalSignatureAssempbly));
			});
			// Подключаем интерфейс
			services.AddSingleton<DigitalSignature>();
			return services;
		}
	}
}
