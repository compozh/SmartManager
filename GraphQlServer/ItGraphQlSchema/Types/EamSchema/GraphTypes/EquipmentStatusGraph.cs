using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(EquipmentStatus))]
	public class EquipmentStatusGraph : SimpleDictionaryRecordGraph<EamDbContext, EquipmentStatus>
	{
		public EquipmentStatusGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
			AddNavigationListField(name: "equipments", resolve: context => context.Source.Equipments);
			AddNavigationConnectionField(name: "equipmentsConnection",
				resolve: context => context.Source.Equipments, includeNames: new[] {"Equipments"});
			AddNavigationListField(name: "technicalPlaces", resolve: context => context.Source.TechnicalPlaces);
			AddNavigationConnectionField(name: "technicalPlacesConnection",
				resolve: context => context.Source.TechnicalPlaces, includeNames: new[] {"TechnicalPlaces"});
		}
	}
}