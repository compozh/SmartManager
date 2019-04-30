using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class ItObjectGraph: EfObjectGraphType<ItObject>, IItAddInSingleton
	{
		public ItObjectGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
		}
	}
}