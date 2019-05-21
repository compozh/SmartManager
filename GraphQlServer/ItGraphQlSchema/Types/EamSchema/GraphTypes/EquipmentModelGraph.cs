using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	//[AtributeAddInDI]
	//public class EquipmentModelGraph: EfObjectGraphType<EquipmentModel>
	//{
	//	public EquipmentModelGraph(IEfGraphQLService graphQlService) :
	//		base(graphQlService)
	//	{
	//		Field(x => x.Id).Description("Id"); 
	//		Field(x => x.Name);
	//		Field(x => x.FullName);
	//		Field(x => x.Designation);
	//		Field(name: "modelGroupId", x => x.ResourceGroupId);

	//		//AddNavigationField(
	//		//	name: "modelGroup",
	//		//	resolve: context => context.Source.EquipmentModelGroup,
	//		//	typeof(EquipmentModelGroupGraph));
	//		AddNavigationListField(
	//			name: "equipments",
	//			resolve: context => context.Source.Equipments);
	//		AddNavigationConnectionField(
	//			name: "equipmentsConnection",
	//			resolve: context => context.Source.Equipments,
	//			includeNames: new[] {"Equipments"});
	//		AddNavigationListField(
	//			name: "technicalPlaces",
	//			resolve: context => context.Source.TechnicalPlaces);
	//		AddNavigationConnectionField(
	//			name: "technicalPlacesConnection",
	//			resolve: context => context.Source.TechnicalPlaces,
	//			includeNames: new[] {"TechnicalPlaces"});
	//		AddNavigationListField(
	//			name: "workRequests",
	//			resolve: context => context.Source.WorkRequests);
	//		AddNavigationConnectionField(
	//			name: "workRequestsConnection",
	//			resolve: context => context.Source.WorkRequests,
	//			includeNames: new[] {"WorkRequests"});
	//		AddNavigationListField(
	//			name: "conditionParameterLinks",
	//			resolve: context => context.Source.ConditionParameterLinks);
			
	//	}
	//}
}