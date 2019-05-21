using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ConditionParameter))]
	public class ConditionParameterGraph: EfObjectGraphType<ConditionParameter>
	{
		public ConditionParameterGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.Period, true);
			Field(x => x.MinValue, true);
			Field(x => x.MaxValue, true);
			Field(x => x.IsValid);
			Field(x => x.MeasurementUnitId, true);
			Field(x => x.ConditionParameterTypeId);
			
			AddNavigationField(
				name: "measurementUnit",
				resolve: context => context.Source.MeasurementUnit);
			AddNavigationField(
				name: "conditionParameterType",
				resolve: context => context.Source.ConditionParameterType);
			AddNavigationListField(
				name: "valueRanges",
				resolve: context => context.Source.ValueRanges);
			AddNavigationListField(
				name: "modelLinks",
				resolve: context => context.Source.ModelLinks);
		}
	}
}