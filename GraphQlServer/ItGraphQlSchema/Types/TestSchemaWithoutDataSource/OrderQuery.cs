using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GraphQL.Types;
using ItGraphQlSchema.Types;

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
