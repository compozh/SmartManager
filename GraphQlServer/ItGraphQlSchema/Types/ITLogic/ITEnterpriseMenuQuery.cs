using System.Collections.Generic;
using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.Model;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITEnterpriseMenuQuery:ObjectGraphType<object>
	{
		public ITEnterpriseMenuQuery()
		{

			Name = "Query";
			Field<ListGraphType<MenuItem>>("FavoriteItems", resolve: getFavoriteItems);

		}

		private List<MenuItem> getFavoriteItems(ResolveFieldContext<object> context)
		{
			var list = new List<MenuItem>();

			for (var i = 0; i < 100; i++)
			{
				list.Add(new MenuItem { Code = $"code{i}", Name = $"Menu item {i}", ImageCode = "IT" });
			}

			return list;
		}
	}
}