using GraphQL.Types;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AddInDIAttribute]
	public class MenuModule : ObjectGraphType<MenuModule>
	{
		public MenuModule()
		{
			Name = "MenuParagraph";
			Field(p => p.Title);
			Field(p => p.Tooltip);
			Field<ListGraphType<MenuItem>>("ParagraphItem",
				resolve: ctx => ctx.Source.Items);
		}

		public string Title { get; set; }
		public string Tooltip { get; set; }
		public List<MenuItem> Items { get; set; }
	}
}
