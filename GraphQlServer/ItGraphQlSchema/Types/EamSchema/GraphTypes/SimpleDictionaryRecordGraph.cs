using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.ApiModel
{
	public class SimpleDictionaryRecordGraph: EfObjectGraphType<SimpleDictionaryRecord>, IItAddInSingleton
	{
		public SimpleDictionaryRecordGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.ShortName);
		}
	}
}