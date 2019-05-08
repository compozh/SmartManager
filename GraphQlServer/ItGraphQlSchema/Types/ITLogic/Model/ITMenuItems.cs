using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AtributeAddInDI]
	public class ITMenuItems : ObjectGraphType<ITMenuItems>
	{
		public ITMenuItems()
		{
			Name = "ParagraphItem";
			Field<ListGraphType<MenuItem>>("Items",
				resolve: ctx => ctx.Source.Items);
			Field<MenuModule>("FavoriteModuleContent",
				resolve: ctx => ctx.Source.FavoriteModuleContent);
		}

		public List<MenuItem> Items { get; set; }
		public MenuModule FavoriteModuleContent { get; set; }
	}
}
