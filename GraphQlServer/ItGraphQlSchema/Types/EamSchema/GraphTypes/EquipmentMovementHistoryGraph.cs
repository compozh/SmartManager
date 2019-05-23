using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(EquipmentMovementHistory))]
	public class EquipmentMovementHistoryGraph: EfObjectGraphType<EquipmentMovementHistory>
	{
		public EquipmentMovementHistoryGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.StartDate, true);
			Field(x => x.EndDate, true);
			Field(x => x.EquipmentId, nullable:true);
			Field(x => x.TechnicalPlaceId, true);
			
			AddNavigationField(name: "equipment", resolve: context => context.Source.Equipment);
			AddNavigationField(name: "technicalPlace",resolve: context => context.Source.TechnicalPlace);
		}
	}
}