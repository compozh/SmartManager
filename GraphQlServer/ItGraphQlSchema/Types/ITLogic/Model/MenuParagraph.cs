using GraphQL.Types;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AtributeAddInDI]
	public class MenuParagraph : ObjectGraphType<MenuParagraph>
	{
		public MenuParagraph()
		{
			Name = "MenuParagraph";
			Field(p => p.Title);
			Field(p => p.Tooltip);
			Field<ListGraphType<ParagraphItem>>("ParagraphItem",
				resolve: ctx => ctx.Source.Items);
		}

		public string Title { get; set; }
		public string Tooltip { get; set; }
		public List<ParagraphItem> Items { get; set; }
	}
	[AtributeAddInDI]
	public class ParagraphItem : ObjectGraphType<ParagraphItem>
	{
		public ParagraphItem()
		{
			Name = "ParagraphItem";
			Field(p => p.IsFavorite);
			Field(p => p.Text);
			Field(p => p.Key);
			Field(p => p.Image);
			Field<ListGraphType<ParagraphItem>>("ParagraphItem",
				resolve: ctx => ctx.Source.Items);
		}

		public bool IsFavorite { get; set; }
		public string Text { get; set; }
		public string Key { get; set; }
		public string Image { get; set; }
		public List<ParagraphItem> Items { get; set; }
	}
}
