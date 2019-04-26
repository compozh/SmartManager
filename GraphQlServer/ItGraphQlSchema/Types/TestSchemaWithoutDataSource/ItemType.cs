using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class ItemType : ObjectGraphType<Item>
	{
		public ItemType()
		{
			Name = "Item";

			Field(p => p.Id).Description("Id товара");
			Field(p => p.Name).Description("Наименование товара");
		}
	}
}
