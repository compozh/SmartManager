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
			var builder = new DbContextOptionsBuilder();
			builder.UseSqlServer("fake");
			using (var context = new CommonDbContext(builder.Options))
			{
				EfGraphQLConventions.RegisterInContainer(
					services,
					dbContext: context,
					dbContextFromUserContext: userContext => null);
			}

			ForAllSchemas.Config(services);
			CommonSchema.CommonSchema.Config(services);
			services.AddDbContext<CommonDbContext>(options =>
				options.UseSqlServer(configuration["ConnectionStrings:Connection:ConnectionString"]));
		}
	}
}