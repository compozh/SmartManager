using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(TechnicalPlace))]
	public class TechnicalPlaceGraph: EfObjectGraphType<TechnicalPlace>
	{
		public TechnicalPlaceGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.IsProductionLosses);
			Field(x => x.IsValid);
			Field(x => x.ResponsibleEmployeeId);
			Field(x => x.ItObjectId);
			Field(x => x.CategoryId);
			Field(x => x.StatusId);
			Field(x => x.DepartmentId, nullable:true);
			Field(x => x.ModelId);
			
			AddNavigationField(name: "department",resolve: context => context.Source.Department);
			AddNavigationField(name: "category",resolve: context => context.Source.Category);
			AddNavigationField(name: "status",resolve: context => context.Source.Status);
			AddNavigationField(name: "level",resolve: context => context.Source.Level);
			AddNavigationField(name: "responsibleEmployee",resolve: context => context.Source.ResponsibleEmployee);
			AddNavigationField(name: "model",resolve: context => context.Source.Model);
			AddNavigationListField(name: "workRequests",resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
			AddNavigationListField(name: "movementHistories",resolve: context => context.Source.MovementHistories);
			AddNavigationListField(name: "responsibleSpecialists",resolve: context => context.Source.ResponsibleSpecialists);
			AddNavigationField(name: "itObject",resolve: context => context.Source.ItObject);
		}
	}
}