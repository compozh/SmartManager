using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(ConditionParameterType))]
	public class ConditionParameterTypeGraph: EfObjectGraphType<ConditionParameterType>
	{
		public ConditionParameterTypeGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ParameterGroup);
			Field(x => x.ShortName);
			Field(x => x.WorkRequestDirectionId);
			
			AddNavigationField(name: "workRequestDirection",resolve: context => context.Source.WorkRequestDirection);
			AddNavigationListField(name: "conditionParameters",resolve: context => context.Source.ConditionParameters);
			AddNavigationConnectionField(name: "conditionParametersConnection",resolve: context => context.Source.ConditionParameters);
		}
	}
}