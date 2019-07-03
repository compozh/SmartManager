using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(Employee))]
	public class EmployeeGraph: EfObjectGraphType<CommonDbContext, Employee>
	{
		public EmployeeGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.FullName);
			Field(x => x.FirstName);
			Field(x => x.SecondName);
			Field(x => x.MiddleName);
			Field(x => x.ItObjectId);
			AddNavigationField(
				name: "itObject",
				resolve: context => context.Source.ItObject);
			AddNavigationField(
				name: "department",
				resolve: context => context.Source.Department);
		}
	}
}