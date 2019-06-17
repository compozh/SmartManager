using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Web.DigitalSignature
{
	public static class DigitalSignatureServiceCollectionExtentions
	{
		
			public static void AddDigitalSignature(this IServiceCollection services)
			{
				services.ConfigureOptions(typeof(DigitalSignatureConfigureOptions));
				services.AddSingleton<Controllers.DigitalSignatureController>();
				// добавление сервисов фреймворка MVC
				services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);;

			}
		
	}
}