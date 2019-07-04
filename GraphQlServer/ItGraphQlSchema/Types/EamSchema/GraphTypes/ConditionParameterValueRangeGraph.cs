using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ConditionParameterValueRange))]
	public class ConditionParameterValueRangeGraph: EfObjectGraphType<CommonDbContext, ConditionParameterValueRange>
	{
		public ConditionParameterValueRangeGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Description);
			Field(x => x.Color);
			Field(x => x.MinValue);
			Field(x => x.MaxValue);
			Field(x => x.WorkRequestCategoryId);
			Field(x => x.ConditionParameterId);
			
			AddNavigationField(name: "category",resolve: context => context.Source.Category);
			AddNavigationField(name: "conditionParameter",resolve: context => context.Source.ConditionParameter);
		}
	}
}