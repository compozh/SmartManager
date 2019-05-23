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

	}
}
