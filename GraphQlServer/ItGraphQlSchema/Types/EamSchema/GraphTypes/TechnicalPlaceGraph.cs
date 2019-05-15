using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
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
			AddNavigationField(
				name: "department",
				resolve: context => context.Source.Department,
				typeof(DepartmentGraph));
			AddNavigationField(
				name: "category",
				resolve: context => context.Source.Category,
				typeof(EquipmentCategoryGraph));
			AddNavigationField(
				name: "status",
				resolve: context => context.Source.Status,
				typeof(EquipmentStatusGraph));
			AddNavigationField(
				name: "level",
				resolve: context => context.Source.Level,
				typeof(TechnicalPlaceLevelGraph));
			AddNavigationField(
				name: "responsibleEmployee",
				resolve: context => context.Source.ResponsibleEmployee,
				typeof(EmployeeGraph));
			AddNavigationField(
				name: "model",
				resolve: context => context.Source.Model,
				typeof(EquipmentModelGraph));
//			Field("equipment",
//				x => x.MovementHistories.Where(m => m.EndDate == null).Select(m => m.Equipment).FirstOrDefault(),
//				nullable: true, typeof(EquipmentGraph));
			AddNavigationListField(
				name: "workRequests",
				resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(
				name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests,
				includeNames: new[] {"WorkRequests"});
			AddNavigationListField(
				name: "movementHistories",
				resolve: context => context.Source.MovementHistories);
			AddNavigationConnectionField(
				name: "movementHistoriesConnection",
				resolve: context => context.Source.MovementHistories,
				includeNames: new[] {"MovementHistories"});
			AddNavigationField(
				name: "itObject",
				resolve: context => context.Source.ItObject,
				typeof(ItObjectGraph));
		}
	}
}