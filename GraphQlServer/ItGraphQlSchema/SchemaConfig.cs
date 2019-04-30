using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services)
		{
			ForAllSchemas.Config(services);
			CommonSchema.CommonSchema.Config(services);
			Types.EamSchema.EamSchema.Config(services);
		}
	}
}