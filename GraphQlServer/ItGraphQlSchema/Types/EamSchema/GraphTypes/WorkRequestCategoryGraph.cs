using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestCategory))]
	public class WorkRequestCategoryGraph : SimpleDictionaryRecordGraph<EamDbContext, WorkRequestCategory>
	{
		public WorkRequestCategoryGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
			AddNavigationListField(name: "workRequests",resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
		}
	}
}