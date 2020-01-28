using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RazorEngine;
using RazorEngine.Configuration;
using RazorEngine.Templating;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Razor.Parser;

namespace SmartId.Services
{
	/// <summary>
	/// Фабрика содержимого писем
	/// </summary>
	public interface IHtmlTemplateExecutor
	{
		/// <summary>
		/// Получить шаблон письма по модели
		/// </summary>
		/// <param name="typeContent"></param>
		/// <param name="model"></param>
		/// <returns></returns>
		string GetContent<T>(string templateName, T model);
	}

	/// <summary>
	/// Подключение сервиса отправки почты
	/// </summary>
	public static class TemplateExecutorExtentions
	{
		/// <summary>
		/// Добавить шаблоны Razor
		/// </summary>
		public static void AddRazorTemplateExecutor(this IServiceCollection services, TemplateExecutorOptions razorTemplateFactoryOptions)
		{
			services.AddSingleton(razorTemplateFactoryOptions);
			services.AddSingleton<IHtmlTemplateExecutor, RazorTemplateExecutor>();
		}

		/// <summary>
		/// Добавить простые шаблоны
		/// </summary>
		public static void AddSimpleTemplateExecutor(this IServiceCollection services, TemplateExecutorOptions razorTemplateFactoryOptions)
		{
			services.AddSingleton(razorTemplateFactoryOptions);
			services.AddSingleton<IHtmlTemplateExecutor, SimpleTemplateExecutor>();
		}
	}

	public class TemplateExecutorOptions
	{
		public TemplateExecutorOptions(string templatePath = null)
		{
			TemplatePath = templatePath ?? "MailTemplates";
		}
		public string TemplatePath { get; set; }
	}

	public class SimpleTemplateExecutor : IHtmlTemplateExecutor
	{
		private readonly ILogger<SimpleTemplateExecutor> _logger;
		private IMemoryCache _cache;
		private string _rootPath;
		private object __lockObj = new object();

		public SimpleTemplateExecutor(TemplateExecutorOptions razorTemplateFactoryOptions, IWebHostEnvironment environment, ILogger<SimpleTemplateExecutor> logger, IMemoryCache memoryCache)
		{
			if (razorTemplateFactoryOptions == null) throw new ArgumentNullException(nameof(razorTemplateFactoryOptions));
			// Find templates in a web application
			_rootPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, razorTemplateFactoryOptions.TemplatePath);
			_logger = logger;
			_cache = memoryCache;
		}
		public string GetContent<T>(string templateName, T model)
		{
			var template = getTemplate(templateName);
			if (template == null)
			{
				return null;
			}
			foreach (var param in model.GetType().GetProperties())
			{
				template = template.Replace("{{" + param.Name + "}}", param.GetValue(model).ToString());
			}
			return template;
		}

		private string getTemplate(string templateName)
		{
			var culture = Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;
			var filename = Path.Combine(_rootPath, $"{templateName}.{culture}.sthtml");

			string template = _cache.Get<string>(templateName);
			if (string.IsNullOrWhiteSpace(template))
			{
				if (!File.Exists(filename))
				{
					_logger.LogError($"Template {templateName} not found ({filename})");
					return null;
				}
				lock (__lockObj)
				{
					template = _cache.GetOrCreate(templateName, f =>
					{
						string tmplt;
						using (var file = File.OpenText(filename))
						{
							tmplt = file.ReadToEnd();
						}
						return tmplt;
					});
				}
			}
			return template;
		}
	}

	public class RazorTemplateExecutor : IHtmlTemplateExecutor
	{
		private readonly IRazorEngineService _service;
		public RazorTemplateExecutor(TemplateExecutorOptions razorTemplateFactoryOptions, IWebHostEnvironment environment)
		{
			if (razorTemplateFactoryOptions == null) throw new ArgumentNullException(nameof(razorTemplateFactoryOptions));
			// Find templates in a web application
			var webPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "bin", razorTemplateFactoryOptions.TemplatePath);
			// Find templates from a unit test or console application
			var libraryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, razorTemplateFactoryOptions.TemplatePath);

			var config = new TemplateServiceConfiguration
			{
				TemplateManager = new ResolvePathTemplateManager(new[] { webPath, libraryPath })
			};

			_service = RazorEngineService.Create(config);
		}

		public string GetContent<T>(string templateName, T model)
		{
			var templateKey = _service.GetKey(templateName);
			var body = Engine.Razor.RunCompile(templateKey, null, model);

			return body;
		}
	}
}
