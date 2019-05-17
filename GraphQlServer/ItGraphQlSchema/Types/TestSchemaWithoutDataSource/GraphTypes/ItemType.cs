using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class ItemType : EfObjectGraphType<Item>
	{
		public ItemType(IEfGraphQLService service):base(service)
		{
			Name = "Item";

			Field(p => p.Id).Description("Id товара");
			Field(p => p.Name).Description("Наименование товара");
			AddNavigationListField("OrdersLink", resolve: context => context.Source.OrdersLink);
			
		}
	}
	[AtributeAddInDI]

	public class ItemInput : InputObjectGraphType<Item>
	{
		public ItemInput() 
		{
			Name = "ItemInput";
			Field(p => p.Id, nullable:true).Description("Id товара");
			Field(p => p.Name, nullable:true).Description("Наименование товара");
		}
	}

}
