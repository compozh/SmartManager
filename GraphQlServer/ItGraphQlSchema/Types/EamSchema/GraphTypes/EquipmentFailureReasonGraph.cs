using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(EquipmentFailureReason))]
	public class EquipmentFailureReasonGraph: EfObjectGraphType<CommonDbContext, EquipmentFailureReason>
	{
		public EquipmentFailureReasonGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}