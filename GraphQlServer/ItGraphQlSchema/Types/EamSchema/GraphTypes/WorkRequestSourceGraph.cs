using GraphQL.Types;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestSource))]
	public class WorkRequestSourceGraph : EnumerationGraphType<WorkRequestSource>
	{
	}
}