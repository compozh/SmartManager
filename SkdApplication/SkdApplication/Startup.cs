using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SkdApplication.Authentification;
using System;
using System.Linq;
using Authentification;
using Microsoft.AspNetCore.Http;
using WebRequests;
using WebTools;

namespace SkdApplication
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

			// Add framework services.
			services.AddMvc()
				.SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
				.AddApplicationPart(typeof(SkdLogic.SkdLogic).Assembly)
				.AddApplicationPart(typeof(AccountController).Assembly);

			services.AddDistributedMemoryCache();
			services.AddSession(options => {
				options.Cookie.Name = "SKDAPP_SESSIONID";
				options.IdleTimeout = TimeSpan.FromSeconds(3600);
			});

			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddSingleton<IAuthOptions, AuthOptions>();
			services.AddSingleton<IIdentityProvider, WebRequestsIdentityProvider>();
			services.AddSingleton<SkdLogic.SkdLogic>();
			services.AddSingleton<WebRequestsTools>();
			services.AddHttpClient();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, IHttpContextAccessor contextAccessor)
		{
			if (env.IsDevelopment())
			{
				// Webpack initialization with hot-reload.
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
					HotModuleReplacement = true,
				});
			}
			app.UseDeveloperExceptionPage();
			app.UseSession();
			app.UseStaticFiles();

			app.UseAuthentication();
			app.UseMvc(routes => {
				routes.MapRoute(name: "default",template: "{controller=Home}/{action=Index}/{id?}");
				routes.MapSpaFallbackRoute(name: "spa-fallback",defaults: new { controller = "Home", action = "Index" });
			});

			SessionHandler.Configure(contextAccessor);

		}
	}
}
