using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	public class EquipmentStatusGraph: EfObjectGraphType<EquipmentStatus>
	{
		public EquipmentStatusGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
			AddNavigationListField(
				name: "equipments",
				resolve: context => context.Source.Equipments);
			AddNavigationConnectionField(
				name: "equipmentsConnection",
				resolve: context => context.Source.Equipments,
				includeNames: new[] {"Equipments"});
			AddNavigationListField(
				name: "technicalPlaces",
				resolve: context => context.Source.TechnicalPlaces);
			AddNavigationConnectionField(
				name: "technicalPlacesConnection",
				resolve: context => context.Source.TechnicalPlaces,
				includeNames: new[] {"TechnicalPlaces"});
		}
	}
}