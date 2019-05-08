using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AtributeAddInDI]
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