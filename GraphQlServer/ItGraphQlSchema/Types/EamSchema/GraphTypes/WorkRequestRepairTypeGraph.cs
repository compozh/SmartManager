using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestRepairType))]
	public class WorkRequestRepairTypeGraph: SimpleDictionaryRecordGraph<EamDbContext, WorkRequestRepairType>
	{
		public WorkRequestRepairTypeGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
			AddNavigationListField(name: "workRequests",resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
		}
	}
}