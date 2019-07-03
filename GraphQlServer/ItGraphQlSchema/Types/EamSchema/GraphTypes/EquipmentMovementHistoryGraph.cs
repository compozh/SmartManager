using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(EquipmentMovementHistory))]
	public class EquipmentMovementHistoryGraph: EfObjectGraphType<CommonDbContext, EquipmentMovementHistory>
	{
		public EquipmentMovementHistoryGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.StartDate, true, type:typeof(DateTimeGraphType));
			Field(x => x.EndDate, true, type:typeof(DateTimeGraphType));
			Field(x => x.EquipmentId, nullable:true);
			Field(x => x.TechnicalPlaceId, true);
			
			AddNavigationField(name: "equipment", resolve: context => context.Source.Equipment);
			AddNavigationField(name: "technicalPlace",resolve: context => context.Source.TechnicalPlace);
		}
	}
}