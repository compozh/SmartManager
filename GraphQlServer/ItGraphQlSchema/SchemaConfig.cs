using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services, IConfiguration configuration)
		{
			ForAllSchemas.Config(services);
			CommonSchema.CommonSchema.Config(services);
			Types.EamSchema.EamSchema.Config(services, configuration);
		}
	}
}