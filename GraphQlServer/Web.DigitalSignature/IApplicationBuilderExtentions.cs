using Microsoft.AspNetCore.Builder;

namespace Web.DigitalSignature
{
	public static class IApplicationBuilderExtentions
	{
		public static void UseDigitalSignature(this IApplicationBuilder app)
		{
			app.UseMiddleware<ProxyHandler>();
			app.UseMvcWithDefaultRoute();

		}
		
	}
}