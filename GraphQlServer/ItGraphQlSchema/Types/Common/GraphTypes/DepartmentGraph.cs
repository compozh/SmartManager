using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(Department))]
	public class DepartmentGraph: EfObjectGraphType<CommonDbContext, Department>
	{
		public DepartmentGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Код подразделения"); 
			Field(x => x.Name).Description("Наименование подразделения");
		}
	}
}