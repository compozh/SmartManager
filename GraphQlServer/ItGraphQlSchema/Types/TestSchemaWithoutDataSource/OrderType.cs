using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class OrderType : ObjectGraphType<Order>
	{
		public OrderType(OrderProvider provider)
		{
			Name = "Order";

			Field(p => p.Id).Description("Id заказчика");
			Field(p => p.Name).Description("Заказчик");
			Field<ListGraphType<ItemType>>("Items", resolve: context => {
				return provider.GetItemsForOrder(context.Source);
			},description : "Заказы");
		}
	}
}
