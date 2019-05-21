using GraphQL.EntityFramework;
using GraphQL.Types;
using GraphQL.Utilities;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.EamSchema;
using ItGraphQlSchema.Types.EamSchema.GraphTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types
{
	[AddInDIAttribute]
	public class OrderQuery : QueryGraphType
	{
		public OrderQuery(IEfGraphQLService efGraphQlService, OrderProvider provider):base(efGraphQlService)
		{
			Name = "OrderQuery";
			AddQueryField("Orders", resolve: context => provider.Orders);
			AddQueryField("Items", resolve: context => provider.Items);
			
		}
		

		public static void Config(IServiceCollection services, IConfiguration configuration)
		{
			
			services.AddDbContext<OrderDbContext>(options =>
				options.UseSqlServer(configuration["ConnectionStrings:Connection:ConnectionString"]));
			
			EfGraphQLConventions.RegisterInContainer(services, OrderDbContext.DataModel);
			GraphTypeTypeRegistry.Register<ItGraphQlSchema.Types.Order, OrderType>();
			GraphTypeTypeRegistry.Register<ItGraphQlSchema.Types.Item, ItemType>();
			GraphTypeTypeRegistry.Register<ItGraphQlSchema.Types.OrderItem, OrderItemType>();

		}
	}
}
