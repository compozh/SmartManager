using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartId.Extensions;
using SmartId.Data;
using SmartId.Models;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Web.WebRequests;
using SmartId.Authentication;
using Serilog;
using SmartId.Services;
using Microsoft.Extensions.FileProviders;
using System.Reflection;
using Shared.DigitalSignature;
using Shared.WebExtensions;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation;

namespace SmartId
{
	public class Startup
	{
		private IConfiguration _configuration { get; }
		private IWebHostEnvironment _environment { get; }

		public Startup(IConfiguration configuration, IWebHostEnvironment environment)
		{
			_configuration = configuration;
			_environment = environment;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));

			/* Настраиваем предупреждение об использовании Cookie  */
			services.Configure<CookiePolicyOptions>(options =>
			{
				// пользователю необходимо показать согласие на куки файлы
				options.CheckConsentNeeded = context => true;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});

			/* Настраиваем веб расчеты */
			services.AddPureWebCalculationsSqlClientInstance("WebCalculationConnection");
			services.AddSingleton<PureWebCalculations>();

			/* Настраиваем Asp Identity */
			services.AddScoped<IExtrnalSignIn<SmartIdUser>, TbnUserStore<SmartIdUser>>().Configure<TbnUserStorageOptions>(options => {
				options.WebCalculationUser = _configuration.GetValue<string>("AppSettings:WEBUSER");
			});
			services.AddDbContext<AspIdentityDbContext>(options => options.UseSqlServer(_configuration.GetConnectionString("IdentityConnection")));
			services.AddIdentity<SmartIdUser, IdentityRole>(options => {
				//TODO: параметры AddIdentityCore
				// Password settings.
				options.Password.RequireDigit = true;
				options.Password.RequireLowercase = true;
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequireUppercase = true;
				options.Password.RequiredLength = 6;
				options.Password.RequiredUniqueChars = 1;

				// TODO: testit
				options.SignIn.RequireConfirmedAccount = true;
				// обязательно тербовать подтверждения почты
				options.SignIn.RequireConfirmedEmail = true;
			}).AddEntityFrameworkStores<AspIdentityDbContext>()
				.AddUserManager<DualStorageUserManager<SmartIdUser>>()
				.AddClaimsPrincipalFactory<SmartIdClaimsPrincipalFactory>()
				.AddDefaultTokenProviders();

			/* Настраиваем MVC */
			// Подключаем КЭЦП
			services.AddDigitalSignature();
			services.AddControllersWithViews()
				.AddRazorRuntimeCompilation()
				// Подключаем контроллеры из сборки КЭЦП
				.AddApplicationPart(typeof(DigitalSignatureExtensions).GetTypeInfo().Assembly);
			services.AddRazorPages();

			/* Настраиваем IIS */
			services.Configure<IISOptions>(iis =>
			{
				iis.AuthenticationDisplayName = "Windows";
				iis.AutomaticAuthentication = false;
				//TODO: разобраться с настройками IIS
			});

			/* Настраиваем IdentityServer */
			services.AddSmartIdIdentityServer();

			/* Настраиваем аутентификацию */
			services.AddAuthentication()
				.AddExternalAuthenticationProviders();

			/* Внутренние сервисы */
			services.AddMemoryCache();
			services.AddSimpleTemplateExecutor(new TemplateExecutorOptions("MailTemplates"));
			services.AddEmailSender();
			services.AddTempFiles();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app)
		{
			// TODO: Добавить HealthChecks
			if (_environment.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}
			app.UseHttpsRedirection();
			app.UseStaticFiles();
			// Подключаем скрипты из сборки КЭЦП
			app.UseDigitalSignature();

			app.UseRouting();
			app.UseCors();

			app.UseIdentityServer();
			app.UseCookiePolicy();

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseScriptNonce();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller=Home}/{action=Index}/{id?}");
				endpoints.MapRazorPages();
			});
		}
	}
}
