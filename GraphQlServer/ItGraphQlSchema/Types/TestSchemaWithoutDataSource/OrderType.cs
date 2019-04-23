using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class OrderType : ObjectGraphType<Order>, IItAddInSingleton
	{
		public OrderType()
		{
			Name = "Order";

			Field(p => p.Id).Description("Id  заказа");
			Field(p => p.Name).Description("Заказчик");
			Field<ListGraphType<ItemType>>("Items", description: "айтемы");
		}
	}
}
