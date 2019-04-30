using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EquipmentModelGroupGraph: EfObjectGraphType<EquipmentModelGroup>, IItAddInSingleton
	{
		public EquipmentModelGroupGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ParentId);
			AddNavigationField(
				name: "parent",
				resolve: context => context.Source.Parent,
				typeof(EquipmentModelGroupGraph));
			AddNavigationListField(
				name: "equipmentModels",
				resolve: context => context.Source.EquipmentModels);
			AddNavigationConnectionField(
				name: "equipmentModelsConnection",
				resolve: context => context.Source.EquipmentModels,
				includeNames: new[] {"EquipmentModels"});
			
		}
	}
}