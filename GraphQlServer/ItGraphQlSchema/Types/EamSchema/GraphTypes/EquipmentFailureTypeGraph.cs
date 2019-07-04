using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(EquipmentFailureType))]
	public class EquipmentFailureTypeGraph : EfObjectGraphType<CommonDbContext, EquipmentFailureType>
	{
		public EquipmentFailureTypeGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}