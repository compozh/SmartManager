using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	public class EquipmentTypeGraph: EfObjectGraphType<EquipmentType>
	{
		public EquipmentTypeGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ModelGroupId);
			AddNavigationField(
				name: "modelGroup",
				resolve: context => context.Source.ModelGroup,
				typeof(EquipmentModelGroupGraph));
			AddNavigationListField(
				name: "equipments",
				resolve: context => context.Source.Equipments);
			AddNavigationConnectionField(
				name: "equipmentsConnection",
				resolve: context => context.Source.Equipments,
				includeNames: new[] {"Equipments"});
		}
	}
}