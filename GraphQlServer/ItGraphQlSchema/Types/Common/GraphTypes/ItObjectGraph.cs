using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(ItObject))]
	public class ItObjectGraph: EfObjectGraphType<CommonDbContext, ItObject>
	{
		public ItObjectGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
		}
	}
}