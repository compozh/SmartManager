using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestCategory))]
	public class WorkRequestCategoryGraph : EfObjectGraphType<CommonDbContext, WorkRequestCategory>
	{
		public WorkRequestCategoryGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);

			AddNavigationListField(name: "workRequests", resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
		}
	}
}