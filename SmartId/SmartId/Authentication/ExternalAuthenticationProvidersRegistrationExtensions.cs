using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared.DigitalSignature.Authentication;
using SmartId.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Extensions
{
	/// <summary>
	/// Регистрация внешних провайдеров аутентификации
	/// </summary>
	public static class ExternalAuthenticationProvidersRegistrationExtensions
	{
		public static AuthenticationBuilder AddExternalAuthenticationProviders(this AuthenticationBuilder builder)
		{
			var provider = builder.Services.BuildServiceProvider();
			var configuration = provider.GetService<IConfiguration>();
			if (configuration["Authentication:Google:ClientId"] != null)
			{
				builder.AddGoogle(options =>
				{
					options.ClientId = configuration["Authentication:Google:ClientId"];
					options.ClientSecret = configuration["Authentication:Google:ClientSecret"];
				});
			}
			if (configuration.GetValue<bool>("Authentication:QesdUA"))
			{
				builder.AddQedsAuthentication(options => {
					options.AuthorizationEndpoint = "/qeds/sign";
				});
			}
			return builder;
		}
	}
}
