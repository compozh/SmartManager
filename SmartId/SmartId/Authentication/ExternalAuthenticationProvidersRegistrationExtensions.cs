using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
				builder.AddGoogle(o =>
				{
					o.ClientId = configuration["Authentication:Google:ClientId"];
					o.ClientSecret = configuration["Authentication:Google:ClientSecret"];
				});
			}
			return builder;
		}
	}
}
