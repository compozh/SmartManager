using GraphQL.Types;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AtributeAddInDI]
	public class MenuItem : ObjectGraphType<MenuItem>
	{
		public MenuItem()
		{
			Name = "MenuItem";
			Field(p => p.Text);
			Field(p => p.CodeMenu);
			Field(p => p.IsFolder);
			Field(p => p.Image);
			Field<ListGraphType<MenuItem>>("Nodes",
				resolve: ctx=> ctx.Source.Nodes);
		}

		public string Text { get; set; }
		public string CodeMenu { get; set; }
		public bool IsFolder { get; set; }
		public string Image { get; set; }
		public List<MenuItem> Nodes { get; set; }
	}
}