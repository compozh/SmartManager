using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using AuthenticationMiddleware;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Web.Authentication;
using Web.WebRequests;
using Web.Tools;
using Web.Data;
using WebAppBuilderMiddleware;

namespace WebAppBuilderApi
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
					options.TokenValidationParameters = new TokenValidationParameters
					{
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
				options.Cookie.Name = "WebAppBuilder";
				options.IdleTimeout = TimeSpan.FromSeconds(3600);
			});
			
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			
			
			// Обработка запросов конструктора
			services.AddSingleton<WebAppBuilderSettings>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, IHttpContextAccessor contextAccessor)
		{

			app.UseCors("MyPolicy");

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
			app.UseMiddleware<Authentication>(new AuthenticationSettings());
			app.UseMiddleware<WebAppBuilderMiddleware.WebAppBuilder>();
			//app.UseHttpsRedirection();
			HttpContextAccessorHandler.Configure(contextAccessor);
			
			//handle client side routes
			app.Run( async (context) =>
			{
				context.Response.ContentType = "text/html";
				await context.Response.SendFileAsync(Path.Combine(env.WebRootPath,"index.html"));
			});
		}
	}
}
