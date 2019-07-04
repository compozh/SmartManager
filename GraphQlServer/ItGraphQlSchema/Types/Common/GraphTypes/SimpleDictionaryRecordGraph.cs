using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(SimpleDictionaryRecord))]
	public class SimpleDictionaryRecordGraph : SimpleDictionaryRecordGraph<CommonDbContext, SimpleDictionaryRecord>
	{
		public SimpleDictionaryRecordGraph(IEfGraphQLService<CommonDbContext> graphQlService) : base(graphQlService)
		{
		}
	}
	
	public class SimpleDictionaryRecordGraph<TDbContext, T> : EfObjectGraphType<TDbContext, T>
		where T : SimpleDictionaryRecord where TDbContext : CommonDbContext
	{
		public SimpleDictionaryRecordGraph(IEfGraphQLService<TDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Name);
			Field(x => x.ShortName);
			Field(x => x.IsValid);
		}
	}
}