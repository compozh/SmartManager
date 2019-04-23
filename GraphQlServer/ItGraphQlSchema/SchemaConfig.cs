using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema
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