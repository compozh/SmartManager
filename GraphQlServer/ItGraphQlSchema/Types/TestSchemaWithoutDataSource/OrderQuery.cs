using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class OrderQuery : ObjectGraphType<object>
	{
		public OrderQuery(OrderProvider provider)
		{
			Name = "OrderQuery";

			Field<ListGraphType<OrderType>>("Order",
				resolve: (context => provider.GetOrders()),
				description: "Заказы");
		}
	}
}
