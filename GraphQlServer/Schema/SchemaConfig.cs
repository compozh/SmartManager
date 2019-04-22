using Microsoft.Extensions.DependencyInjection;

namespace SkdSchema
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services)
		{
			SkdSchema.Config(services);
			CommonSchema.CommonSchema.Config(services);
		}
	}
}