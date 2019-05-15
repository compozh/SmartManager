using GraphQL.Types;
using Newtonsoft.Json;
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
			Field(p => p.LinkToRMD);
			Field<ListGraphType<MenuItem>>("Nodes",
				resolve: ctx=> ctx.Source.Items);
		}

		public string Text { get; set; }
		[JsonProperty("CodeMenu")]
		public string CodeMenu { get; set; }
		[JsonProperty("Key")]
		private string Key { set { CodeMenu = value; } }
		public bool IsFolder { get; set; }
		public string Image { get; set; }
		[JsonProperty("ITEMS")]
		public List<MenuItem> Items { get; set; }
		[JsonProperty("Nodes")]
		private List<MenuItem> Nodes { set { Items = value; } }

		public string LinkToRMD { get; set; }

		[JsonProperty("WebClientStartParams")]
		private string link { 
			set {
				if (!string.IsNullOrEmpty(value))
				{
					LinkToRMD = value;
				}
				else
				{
					LinkToRMD = "";
				}
			}
		}
	}
}