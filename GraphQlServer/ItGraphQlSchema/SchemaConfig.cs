using System;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema
{
	public static class SchemaConfig
	{
		public static void ConfigSchemas(this IServiceCollection services, IConfiguration configuration)
		{
			AddDbContext<CommonDbContext>(services, configuration);
			AddDbContext<EamDbContext>(services, configuration);
			ForAllSchemas.Config(services);
			CommonSchema.CommonSchema.Config(services);
		}

		private static void AddDbContext<TDbContext>(IServiceCollection services, IConfiguration configuration) where TDbContext : DbContext
		{
			var builder = new DbContextOptionsBuilder<TDbContext>();
			builder.UseSqlServer("fake");
			using (var context = (TDbContext) Activator.CreateInstance(typeof(TDbContext), builder.Options))
			{
				EfGraphQLConventions.RegisterInContainer(services, context, userContext => null);
			}

			services.AddDbContext<TDbContext>(options =>
				options.UseSqlServer(configuration["ConnectionStrings:Connection:ConnectionString"]));
		}
	}
}