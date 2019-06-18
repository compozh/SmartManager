using System;
using AuthenticationMiddleware;
using GraphQL;
using GraphQL.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ItGraphQlSchema;
using Web.Authentication;
using Web.Data;
using Web.Tools;
using Web.WebRequests;
using Microsoft.Extensions.Caching.Memory;
using GraphQlServer.CultureMiddleware;
using Microsoft.AspNetCore.Mvc;
using Web.DigitalSignature;

namespace GraphQlServer
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			var languages = Configuration.GetSection("AppSettings")["SupportedCultures"] ?? "ru";
			var lang = languages.Split(",", StringSplitOptions.RemoveEmptyEntries);
			//Добавление локализации
			services.Configure<RequestLocalizationOptions>(options => {
				options.AddSupportedCultures(lang);
				options.AddSupportedUICultures(lang);
				options.RequestCultureProviders.Clear();
				options.RequestCultureProviders.Add(new ItCultureProvider());
			});
			services.AddLocalization(options => options.ResourcesPath = "Properties");

			//Настройка cors
			services.AddCors(o => o.AddPolicy("MyPolicy", builder => {

				var allowedOrigins = Configuration.GetSection("AppSettings")["AllowedOrigins"] ?? string.Empty;
				var origins = allowedOrigins.Split(",", StringSplitOptions.RemoveEmptyEntries);
				
				builder.WithOrigins(origins)
					.AllowAnyMethod()
					.AllowCredentials()
					.WithHeaders("Authorization", "Accept")
					.AllowAnyHeader();
			}));
		
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options => {
					var localOptions = new AuthOptions();
					options.RequireHttpsMetadata = false;
					options.TokenValidationParameters = new TokenValidationParameters {
						// укзывает, будет ли валидироваться издатель при валидации токена
						ValidateIssuer = true,
						// строка, представляющая издателя
						ValidIssuer = localOptions.Issuer,
						// будет ли валидироваться потребитель токена
						ValidateAudience = true,
						// установка потребителя токена
						ValidAudience = localOptions.Audience,
						// будет ли валидироваться время существования
						ValidateLifetime = true,
						// установка ключа безопасности
						IssuerSigningKey = localOptions.GetSymmetricSecurityKey(),
						// валидация ключа безопасности
						ValidateIssuerSigningKey = true,
					};
				});
			
			// Веб расчеты и аутентификация
			services.AddSingleton<IAuthOptions, AuthOptions>();
			services.AddSingleton<IIdentityProvider, WebRequestsIdentityProvider>();
			services.AddSingleton<AuthenticationTools>();
			services.AddSingleton<WebRequestsTools>();
			services.AddSqlClientInstance(Configuration);
			services.AddSingleton<PureWebCalculations>();
			// Сессия
			services.AddDistributedMemoryCache();
			services.AddSession(options => {
				options.Cookie.Name = "GraphQlSessionID";
				options.IdleTimeout = TimeSpan.FromSeconds(3600);
			});


			services.AddSingleton<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));
			// Утилиты GraphQl
			services.AddSingleton<IDocumentExecuter, DocumentExecuter>();
			services.AddSingleton<IDocumentWriter, DocumentWriter>();

			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

			services.ConfigSchemas(Configuration);
			services.AddSingleton<SchemaSelector>();
			services.AddSingleton<IMemoryCache, MemoryCache>();
			services.AddDigitalSignature();

			
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IHttpContextAccessor contextAccessor)
		{
			app.UseCors("MyPolicy");

			loggerFactory.AddConsole();

			app.UseDeveloperExceptionPage();
			app.UseSession();
			app.UseRequestLocalization();
			
			app.UseAuthentication();
			app.UseMiddleware<Authentication>(new AuthenticationSettings());
			app.UseMiddleware<GraphQLMiddleware>(new GraphQLSettings {
				BuildUserContext = ctx => new GraphQLUserContext {
					User = ctx.User
				}
			});


			app.UseDigitalSignature();
			
			HttpContextAccessorHandler.Configure(contextAccessor);
			app.UseDefaultFiles();
			app.UseStaticFiles();
		}
	}
}