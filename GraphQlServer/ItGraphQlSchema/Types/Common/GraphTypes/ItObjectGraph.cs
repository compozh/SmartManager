using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(ItObject))]
	public class ItObjectGraph: EfObjectGraphType<ItObject>
	{
		public ItObjectGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
		}
	}
}