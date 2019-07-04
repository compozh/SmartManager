using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(EquipmentFailureType))]
	public class EquipmentFailureTypeGraph : SimpleDictionaryRecordGraph<EamDbContext, EquipmentFailureType>
	{
		public EquipmentFailureTypeGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
		}
	}
}