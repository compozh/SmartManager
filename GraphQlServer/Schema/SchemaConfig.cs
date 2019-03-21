using Microsoft.Extensions.DependencyInjection;

namespace SkdScheme
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services)
		{
			SkdSchema.SkdSchema.Config(services);
		}
	}
}