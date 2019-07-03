using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(SimpleDictionaryRecord))]
	public class SimpleDictionaryRecordGraph: EfObjectGraphType<CommonDbContext, SimpleDictionaryRecord>
	{
		public SimpleDictionaryRecordGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}