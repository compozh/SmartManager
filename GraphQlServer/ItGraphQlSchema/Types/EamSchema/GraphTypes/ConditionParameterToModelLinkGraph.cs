using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AtributeAddInDI]
	public class ConditionParameterToModelLinkGraph: EfObjectGraphType<ConditionParameterToModelLink>
	{
		public ConditionParameterToModelLinkGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.ConditionParameterId); 
			Field(x => x.EquipmentModelId);
			AddNavigationField(
				name: "conditionParameter",
				resolve: context => context.Source.ConditionParameter);
			AddNavigationField(
				name: "equipmentModel",
				resolve: context => context.Source.EquipmentModel);
		}
	}
}