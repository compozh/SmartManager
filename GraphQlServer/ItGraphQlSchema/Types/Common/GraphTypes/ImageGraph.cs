using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDI, GraphType(typeof(Image))]
	public class ImageGraph : EfObjectGraphType<Image>
	{
		public ImageGraph(IEfGraphQLService graphQLService) : base(graphQLService)
		{
			Name = "Image";
			Field(x => x.Id).Description("Id");
			Field(x => x.Name).Description("Наименование");
			Field(x => x.Extension).Description("Расширение");
		}
	}
}
