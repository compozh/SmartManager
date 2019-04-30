using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	public class WorkRequestDirectionGraph: EfObjectGraphType<WorkRequestDirection>
	{
		public WorkRequestDirectionGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
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