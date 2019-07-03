using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(EquipmentStatus))]
	public class EquipmentStatusGraph: EfObjectGraphType<CommonDbContext, EquipmentStatus>
	{
		public EquipmentStatusGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
			
			AddNavigationListField(name: "equipments", resolve: context => context.Source.Equipments);
			AddNavigationConnectionField(name: "equipmentsConnection",
				resolve: context => context.Source.Equipments, includeNames: new[] {"Equipments"});
			AddNavigationListField(name: "technicalPlaces", resolve: context => context.Source.TechnicalPlaces);
			AddNavigationConnectionField(name: "technicalPlacesConnection",
				resolve: context => context.Source.TechnicalPlaces, includeNames: new[] {"TechnicalPlaces"});
		}
	}
}