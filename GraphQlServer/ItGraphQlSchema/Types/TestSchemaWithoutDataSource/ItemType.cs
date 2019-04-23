using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class ItemType : ObjectGraphType<Item>, IItAddInSingleton
	{
		public ItemType()
		{
			Name = "Item";

			Field(p => p.Id).Description("Id товара");
			Field(p => p.Name).Description("Наименование товара");
		}
	}
}
