using GraphQL.Types;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(ConditionParameterGroup))]
	public class ConditionParameterGroupGraph: EnumerationGraphType<ConditionParameterGroup>
	{
	}
}