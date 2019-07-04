using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(EquipmentFailureReason))]
	public class EquipmentFailureReasonGraph : SimpleDictionaryRecordGraph<EamDbContext, EquipmentFailureReason>
	{
		public EquipmentFailureReasonGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
		}
	}
}