using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	public class EmployeeGraph: EfObjectGraphType<Employee>
	{
		public EmployeeGraph(IEfGraphQLService graphQlService) :
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
				resolve: context => context.Source.ItObject,
				typeof(ItObjectGraph));
			AddNavigationListField(
				name: "declarerWorkRequests",
				resolve: context => context.Source.DeclarerWorkRequests);
			AddNavigationConnectionField(
				name: "declarerWorkRequestsConnection",
				resolve: context => context.Source.DeclarerWorkRequests,
				includeNames: new[] {"WorkRequests"});
			AddNavigationListField(
				name: "responsibleWorkRequests",
				resolve: context => context.Source.ResponcibleWorkRequests);
			AddNavigationConnectionField(
				name: "responsibleWorkRequestsConnection",
				resolve: context => context.Source.ResponcibleWorkRequests,
				includeNames: new[] {"WorkRequests"});
			AddNavigationListField(
				name: "performerWorkRequests",
				resolve: context => context.Source.PerformerWorkRequests);
			AddNavigationConnectionField(
				name: "performerWorkRequestsConnection",
				resolve: context => context.Source.PerformerWorkRequests,
				includeNames: new[] {"WorkRequests"});
			AddNavigationField(
				name: "department",
				resolve: context => context.Source.Department);
		}
	}
}