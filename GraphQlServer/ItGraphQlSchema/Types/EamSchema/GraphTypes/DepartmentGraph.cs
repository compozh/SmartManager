using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class DepartmentGraph: EfObjectGraphType<Department>, IItAddInSingleton
	{
		public DepartmentGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			AddNavigationListField(
				name: "workRequests",
				resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(
				name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests,
				includeNames: new[] {"WorkRequests"});
		}
	}
}