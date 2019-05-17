using System;
using System.Collections.Generic;
using System.Linq;
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
	[AtributeAddInDI]
	public class OrderQueryMutation : ObjectGraphType
	{
		public OrderQueryMutation(OrderProvider provider)
		{
			Name = "OrderQueryMutation";
			// ItemsMutation
			Field<ItemType>("Item", 
				arguments: new QueryArguments(new QueryArgument<MutationTypesEnum>{ Name = "operation"}, new QueryArgument<ItemInput>{ Name = "item"}), 
				resolve: context => {
					var operation = context.GetArgument<MutationTypes>("operation");
					var item = context.GetArgument<Item>("item");


					return provider.MutateItem(operation, item);
				});
			
			Field<OrderType>("Order", 
				arguments: new QueryArguments(new QueryArgument<MutationTypesEnum>{ Name = "operation"}, new QueryArgument<OrderInput>{ Name = "order"}), 
				resolve: context => {
					var operation = context.GetArgument<MutationTypes>("operation");

					var order = context.GetArgument<Order>("order");
					return provider.MutateOrder(operation, order);
				});
			Field<OrderItemType>("OrderItem", 
				arguments: new QueryArguments(new QueryArgument<MutationTypesEnum>{ Name = "operation"}, new QueryArgument<OrderItemInput>{ Name = "orderItem"}), 
				resolve: context => {
					var operation = context.GetArgument<MutationTypes>("operation");
					var orderItem = context.GetArgument<OrderItem>("orderItem");
					return provider.MutateOrderItem(operation, orderItem);

				});
			
		}
		
	}
	
	
	

}
