using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AtributeAddInDI]
	public class EquipmentFailureTypeGraph : EfObjectGraphType<EquipmentFailureType>
	{
		public EquipmentFailureTypeGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}