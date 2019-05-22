using GraphQL.Types;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AddInDIAttribute]
	public class ITMenu : ObjectGraphType<ITMenu>
	{
		public ITMenu()
		{
			Name = "ParagraphItem";
			Field<ListGraphType<MenuItem>>("Items",
				resolve: ctx => ctx.Source.Items);
			Field<MenuModule>("moduleContent",
				resolve: ctx => ctx.Source.FavoriteModuleContent);
			Field(p => p.BaseUrl);
		}

		[JsonProperty("baseUrl")]
		public string BaseUrl { get; set; }
		public List<MenuItem> Items { get; set; }
		public MenuModule FavoriteModuleContent { get; set; }
	}
}
