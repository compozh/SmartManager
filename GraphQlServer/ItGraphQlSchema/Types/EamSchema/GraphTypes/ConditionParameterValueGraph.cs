using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ConditionParameterValue))]
	public class ConditionParameterValueGraph: EfObjectGraphType<ConditionParameterValue>
	{
		public ConditionParameterValueGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Value,true);
			Field(x => x.Date,true);
			Field(x => x.EndDate,true);
			Field(x => x.Description);
			Field(x => x.Comment, true);
			Field(x => x.MeasurementUnitId, true);
			Field(x => x.ConditionParameterId, true);
			Field(x => x.EquipmentId);
			Field(x => x.EquipmentModelId);
			Field(x => x.TechnicalPlaceId, true);
			Field(x => x.DepartmentId, true);

			AddNavigationField(name: "additionalData",resolve: context => context.Source.AdditionalData);
			AddNavigationField(name: "measurementUnit",resolve: context => context.Source.MeasurementUnit);
			AddNavigationField(name: "conditionParameter",resolve: context => context.Source.ConditionParameter);
			AddNavigationField(name: "equipment",resolve: context => context.Source.Equipment);
			AddNavigationField(name: "equipmentModel",resolve: context => context.Source.EquipmentModel);
			AddNavigationField(name: "technicalPlace",resolve: context => context.Source.TechnicalPlace);
			AddNavigationField(name: "department",resolve: context => context.Source.Department);
		}
	}
}