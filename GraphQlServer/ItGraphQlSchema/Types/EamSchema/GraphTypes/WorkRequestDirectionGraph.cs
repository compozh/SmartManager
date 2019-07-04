using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestDirection))]
	public class WorkRequestDirectionGraph : SimpleDictionaryRecordGraph<EamDbContext, WorkRequestDirection>
	{
		public WorkRequestDirectionGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
			AddNavigationListField(name: "workRequests",resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
		}
	}
}