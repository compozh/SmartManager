using GraphQL.Types;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestStatus))]
	public class WorkRequestStatusGraph : EnumerationGraphType<WorkRequestStatus>
	{
	}
}