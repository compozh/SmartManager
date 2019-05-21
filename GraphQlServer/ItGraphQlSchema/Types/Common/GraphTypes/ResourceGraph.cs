using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(Resource))]
	public class ResourceGraph : EfObjectGraphType<Resource>
	{
		public ResourceGraph(IEfGraphQLService graphQlService) : base(graphQlService)
		{
			Name = "Resouce";
			Field(x => x.Id).Description("Идентификатор");
			Field(x => x.Name).Description("Наименование");
			Field(x => x.FullName).Description("Полное наименование");
			Field(x => x.Designation).Description("Обозначение");
			Field(x => x.ResourceGroupId).Description("Код группы ресурсов");

			AddNavigationField(
				name: "resourceGroup",
				resolve: context => context.Source.ResourceGroup)
				.Description = "Группа ресурса";
					   
			AddNavigationField(
				name: "measurementUnit",
				resolve: context => context.Source.MeasurementUnit)
				.Description = "Единица измерения";
		}
	}
}
