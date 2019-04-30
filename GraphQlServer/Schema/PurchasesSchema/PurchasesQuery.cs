using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.WebRequests;

namespace PurchasesSchema
{
	class PurchasesQuery : ObjectGraphType<object>
	{

		public PurchasesQuery(IPurchasesProvider provider)
		{
			Name = "Query";

			async Task<object> Resolve(ResolveFieldContext<object> context)
			{
				var cartItems = await provider.GetCartItems();

				var subfields = context.SubFields["data"].SelectionSet.Children.Cast<GraphQL.Language.AST.Field>();//.Select(s => s.Name).ToList();

				var columns = new CartItemType(provider).Fields;

				var result = new
				{
					data = cartItems.ToList(),
					columns = subfields.Select(s => {
						var col = columns.FirstOrDefault(c => c.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
						return col == null ? null : new { key = s.Name, caption = col.Description };
					}).Where(f => f != null)
				};

				return result;
			}


			Field<CartTableType>("cartItemsTable",
				arguments: new QueryArguments(),
				resolve: (Resolve),
				description: "Перечень позиций корзины");

			Field<ListGraphType<CartItemType>>("cartItems",
				arguments: new QueryArguments(),
				resolve: (context => provider.GetCartItems()),
				description: "Перечень позиций корзины");
		}
	}
}
