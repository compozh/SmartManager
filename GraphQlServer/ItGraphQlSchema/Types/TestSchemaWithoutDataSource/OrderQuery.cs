using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class OrderQuery : ObjectGraphType<object>, IItAddInSingleton
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
