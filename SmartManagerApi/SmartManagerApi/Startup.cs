using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using Microsoft.AspNetCore.Http;
using SmartManagerApi.Authentification;
using Web.Authentication;
using Web.WebRequests;
using Web.Tools;
using SmartManagerApi.Logic;
using Web.Data;
namespace SmartManagerApi
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
			services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
			{
				builder.WithOrigins("http://localhost:8080/", "http://localhost:8080", "https://localhost:8080/", "https://localhost:8080")
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
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
			services.AddDistributedMemoryCache();
			services.AddSession(options => {
				options.Cookie.Name = "SmartManager";
				options.IdleTimeout = TimeSpan.FromSeconds(3600);
			});

			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddSingleton<AuthenticationTools>();
			services.AddSingleton<IAuthOptions, AuthOptions>();
			services.AddSingleton<IIdentityProvider, WebRequestsIdentityProvider>();
			services.AddSingleton<SmartManagerLogic>();
			services.AddSingleton<WebRequestsTools>();
			services.AddHttpClient();

			services.AddSqlClientInstance(Configuration);
			services.AddSingleton<PureWebCalculations>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, IHttpContextAccessor contextAccessor)
		{

			app.UseCors("MyPolicy");

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseHsts();
			}

			app.UseSession();
			app.UseStaticFiles();
			app.UseAuthentication();
			app.UseHttpsRedirection();
			app.UseMvc();
			HttpContextAccessorHandler.Configure(contextAccessor);
		}
	}
}
