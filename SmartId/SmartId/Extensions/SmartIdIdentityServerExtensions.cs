using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using IdentityServer4.Models;
using System.Security.Cryptography.X509Certificates;
using System.Reflection;
using Microsoft.Extensions.Logging;
using System.IO;

namespace SmartId.Extensions
{
	public static class SmartIdIdentityServerExtensions
	{
		public static IServiceCollection AddSmartIdIdentityServer(this IServiceCollection services)
		{
			var provider = services.BuildServiceProvider();
			var configuration = provider.GetService<IConfiguration>();
			var environment = provider.GetService<IWebHostEnvironment>();
			var logger = provider.GetService<ILogger<Startup>>();

			var connectionStringConfiguration = configuration.GetConnectionString("ConfigurationConnection");
			var clientSection = configuration.GetSection("SmartId:Clients");
			var apiSection = configuration.GetSection("SmartId:Api");
			var connectionStringOperational = configuration.GetConnectionString("OperationalConnection");

			// добавляем сервер идентификации
			var builder = services.AddIdentityServer(options =>
			{
				options.Events.RaiseErrorEvents = true;
				options.Events.RaiseInformationEvents = true;
				options.Events.RaiseFailureEvents = true;
				options.Events.RaiseSuccessEvents = true;
				//TODO: Поддержка IdentityModel3, убрать, после решения
				options.AccessTokenJwtType = "JWT";
			});
			// настраиваем хранилище оперативных данных
			builder.AddOperationalStore(options =>
			{
				var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
				options.ConfigureDbContext = contentBuilder => contentBuilder.UseSqlServer(connectionStringOperational,
					b => b.MigrationsAssembly(migrationsAssembly));

				// TODO: this enables automatic token cleanup. this is optional.
				options.EnableTokenCleanup = true;
				//options.TokenCleanupInterval = 30; // interval in seconds, short for testing
			});
			// добавляем информацию о клиентах, апи, cors
			addConfigurations(builder, connectionStringConfiguration, clientSection, apiSection, environment, logger);
			// добавляем механизм идентификации
			builder.AddAspNetIdentity<SmartIdUser>();

			if (environment.IsDevelopment())
			{
				logger.LogInformation($"Development mode");
				builder.AddDeveloperSigningCredential();
			}
			else
			{
				logger.LogInformation($"Productive mode");
				builder.AddCertificates(configuration, environment, logger);
			}

			// TODO: перенести настройки
			return services;
		}

		/// <summary>
		/// Добавить сертификаты
		/// </summary>
		/// <param name="builder"></param>
		public static void AddCertificates(this IIdentityServerBuilder builder, IConfiguration configuration, IWebHostEnvironment environment, ILogger<Startup> logger)
		{
			var certificatePath = configuration.GetValue<string>("SmartId:Keys:MainX509:FilePath");
			var certificatePassword = configuration.GetValue<string>("SmartId:Keys:MainX509:Password");
			var certificateHKLMName = configuration.GetValue<string>("SmartId:Keys:MainX509:CLMName");
			if (string.IsNullOrWhiteSpace(certificateHKLMName) && (string.IsNullOrWhiteSpace(certificatePath) || string.IsNullOrWhiteSpace(certificatePassword)))
			{
				throw new Exception("need to configure key material");
			}

			if (!string.IsNullOrWhiteSpace(certificatePath) && !string.IsNullOrWhiteSpace(certificatePassword))
			{
				try
				{
#pragma warning disable CA2000 // Ликвидировать объекты перед потерей области
					var cert = new X509Certificate2(Path.Combine(environment.ContentRootPath, certificatePath), certificatePassword);
#pragma warning restore CA2000 // Ликвидировать объекты перед потерей области
					if (!cert.HasPrivateKey)
					{
						throw new Exception($"Not found private key [file: {(string.IsNullOrWhiteSpace(certificatePath) ? certificateHKLMName : certificatePath)}]");
					}
					builder.AddSigningCredential(cert);
					logger.LogInformation($"Using {cert.SerialNumber} {cert.FriendlyName} private key ({certificatePath})");
				}
				catch (Exception e)
				{
					throw new Exception($"{e.Message} [file: {certificatePath}]");
				}
			}
			else
			{
				try
				{
					builder.AddSigningCredential(certificateHKLMName, StoreLocation.LocalMachine);
					logger.LogInformation($"Using {certificateHKLMName} private key from local storage");
				}
				catch (Exception e)
				{
					throw new Exception($"{e.Message} [certificate name: {certificateHKLMName}]");
				}
			}

			var list = new List<string>();
			configuration.GetSection("SmartId:Keys:ValidationX509:FilePaths").Bind(list);
			list.ForEach(cert =>
			{
				var certValidation = new X509Certificate2(Path.Combine(environment.ContentRootPath, cert));
				builder.AddValidationKey(certValidation);
				logger.LogInformation($"Using {certValidation.SerialNumber} certificate ({cert})");
			});

			list = new List<string>();
			configuration.GetSection("SmartId:Keys:ValidationX509:CLMNames").Bind(list);
			list.ForEach(name =>
			{
				builder.AddValidationKey(name);
				logger.LogInformation($"Using {name} certificate from local storage");
			});
		}

		private static IEnumerable<IdentityResource> getIdentityResources()
		{
			return new IdentityResource[]
			{
				new IdentityResources.OpenId(),
				new IdentityResources.Profile(),
				new IdentityResources.Email(),
				new IdentityResources.Phone()
			};
		}

		private static void addConfigurations(IIdentityServerBuilder builder, string connectionStrings, IConfigurationSection clientSection,
			IConfigurationSection apiSection, IWebHostEnvironment environment, ILogger<Startup> logger)
		{
			if (!string.IsNullOrWhiteSpace(connectionStrings))
			{
				// this adds the config data from DB (clients, resources, CORS)
				builder.AddConfigurationStore<ConfigurationDbContext>(options =>
				{
					options.ConfigureDbContext = contentBuilder => contentBuilder.UseSqlServer(connectionStrings);
				});
				if (!environment.IsDevelopment())
				{
					builder.AddConfigurationStoreCache();
				}
				logger.LogInformation("Using SQL client & resources repository");
			}
			if (clientSection.Exists())
			{
				builder.AddInMemoryClients(clientSection);
				logger.LogInformation("Using json client repository");
			}
			if (apiSection.Exists())
			{
				builder.AddInMemoryApiResources(apiSection);
				logger.LogInformation("Using json resources repository");
			}
			builder.AddInMemoryIdentityResources(getIdentityResources());
		}
	}
}
