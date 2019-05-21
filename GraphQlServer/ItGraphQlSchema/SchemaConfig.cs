using GraphQL.EntityFramework;
using ItGraphQlSchema.Types;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace ItGraphQlSchema
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services, IConfiguration configuration)
		{
			EfGraphQLConventions.RegisterInContainer(services, CommonDbContext.DataModel);

			ForAllSchemas.Config(services);
			CommonSchema.CommonSchema.Config(services);
			services.AddDbContext<CommonDbContext>(options =>
				options.UseSqlServer(configuration["ConnectionStrings:Connection:ConnectionString"]));
		}
	}
}