using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ConditionParameterAdditionalData))]
	public class ConditionParameterAdditionalDataGraph: EfObjectGraphType<ConditionParameterAdditionalData>
	{
		public ConditionParameterAdditionalDataGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.IsValid);
			Field(x => x.IsEmergency);
			Field(x => x.IsPlanned);
			Field(x => x.DownTimeType);
			Field(x => x.SourceTechPlaceId, true);
			Field(x => x.FailureTypeId);
			Field(x => x.FailureReasonId);
			Field(x => x.DirectionId);
			Field(x => x.ResponsibleId);

			AddNavigationField(name: "responsible", resolve: context => context.Source.Responsible);
			AddNavigationField(name: "sourceTechPlace", resolve: context => context.Source.SourceTechPlace);
			AddNavigationField(name: "failureType", resolve: context => context.Source.FailureType);
			AddNavigationField(name: "failureReason", resolve: context => context.Source.FailureReason);
			AddNavigationField(name: "direction",resolve: context => context.Source.Direction);
		}
	}
}