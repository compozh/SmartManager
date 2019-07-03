using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema.GraphTypes
{
	[AddInDI, GraphType(typeof(ResponsibleSpecialist))]
	public class ResponsibleSpecialistGraph: EfObjectGraphType<CommonDbContext, ResponsibleSpecialist>
	{
		public ResponsibleSpecialistGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.IsResponsible, true);

			AddNavigationField(name: "direction", resolve: context => context.Source.Direction);
			AddNavigationField(name: "employee", resolve: context => context.Source.Employee);
			AddNavigationField(name: "technicalPlace",resolve: context => context.Source.TechnicalPlace);
		}
	}
}