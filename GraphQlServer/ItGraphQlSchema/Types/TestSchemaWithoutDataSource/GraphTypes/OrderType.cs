using System.Linq;
using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AddInDIAttribute]
	public class OrderType : EfObjectGraphType<Order>
	{
		public OrderType(IEfGraphQLService service):base(service)
		{
			Name = "Order";

			Field(p => p.Id).Description("Id заказчика");
			Field(p => p.Name).Description("Заказчик");
			AddNavigationListField("ItemsLink", resolve: context => context.Source.ItemsLink);
		}

		
	}
	
	[AddInDIAttribute]
	public class OrderInput : InputObjectGraphType<Order>
	{
		public OrderInput()
		{
			Name = "OrderInput";
			Field(p => p.Id, nullable:true).Description("Id заказчика");
			Field(p => p.Name, nullable:true).Description("Заказчик");
		}
	}
}
