using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types
{
	[AddInDIAttribute, GraphType(typeof(OrderItem))]
	public class OrderItemType : EfObjectGraphType<CommonDbContext, OrderItem>
	{
		public OrderItemType(IEfGraphQLService<CommonDbContext> service):base(service)
		{
			Name = "OrderItem";

			Field(p => p.ItemId).Description("Id пункта");
			AddNavigationField(name: "Item", resolve: context => context.Source.Item);
			Field(p => p.OrderId).Description("Id заказа");
			Field(p => p.Count).Description("Количество");
			AddNavigationField(name: "Order", resolve: context => context.Source.Order);
			
		}
	}
	
	[AddInDIAttribute]
	public class OrderItemInput : InputObjectGraphType<OrderItem>
	{
		public OrderItemInput()
		{
			Name = "OrderItemInput";

			Field(p => p.ItemId, nullable:true).Description("Id пункта");
			Field(p => p.OrderId, nullable:true).Description("Id заказа");
			Field(p => p.Count, nullable:true).Description("Количество");
		}
	}
}
