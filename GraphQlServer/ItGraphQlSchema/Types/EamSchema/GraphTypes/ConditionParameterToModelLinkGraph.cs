using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ConditionParameterToModelLink))]
	public class ConditionParameterToModelLinkGraph: EfObjectGraphType<CommonDbContext, ConditionParameterToModelLink>
	{
		public ConditionParameterToModelLinkGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.ConditionParameterId); 
			Field(x => x.EquipmentModelId);
			AddNavigationField(name: "conditionParameter",resolve: context => context.Source.ConditionParameter);
			AddNavigationField(name: "equipmentModel",resolve: context => context.Source.EquipmentModel);
		}
	}
}