using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(MeasurementUnit))]
	public class MeasurementUnitGraph: EfObjectGraphType<MeasurementUnit>
	{
		public MeasurementUnitGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.FullName);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}