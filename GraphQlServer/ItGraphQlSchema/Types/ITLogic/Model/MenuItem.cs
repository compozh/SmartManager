using GraphQL.Types;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
	[AtributeAddInDI]
	public class MenuItem : ObjectGraphType<MenuItem>
	{
		public MenuItem()
		{
			Name = "MenuItem";
			Field(p => p.Code);
			Field(p => p.Name);
			Field(p => p.ImageCode);
		}

		public string Code { get; set; }
		public string Name { get; set; }
		public string ImageCode { get; set; }
	}
}