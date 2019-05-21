using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AddInDI, GraphType(typeof(Application))]
	public class ApplicationGraph : EfObjectGraphType<Application>
	{
		public ApplicationGraph(IEfGraphQLService graphQlService) : base(graphQlService)
		{
			Name = "Appliccation";
			Field(p => p.UniqueNumber).Description("Идентификатор заявки");
			Field(p => p.Number).Description("Номер заявки");
			Field(p => p.Date).Description("Дата заявки");
		}
	}
}
