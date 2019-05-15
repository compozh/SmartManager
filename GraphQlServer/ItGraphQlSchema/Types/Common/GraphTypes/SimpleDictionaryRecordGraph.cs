using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AtributeAddInDI]
	public class SimpleDictionaryRecordGraph: EfObjectGraphType<SimpleDictionaryRecord>
	{
		public SimpleDictionaryRecordGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}