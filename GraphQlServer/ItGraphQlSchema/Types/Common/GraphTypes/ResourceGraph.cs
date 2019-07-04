using System.Linq;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common.Data;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(Resource))]
	public class ResourceGraph : EfObjectGraphType<CommonDbContext, Resource>
	{
		public ResourceGraph(IEfGraphQLService<CommonDbContext> graphQlService, IContentManagerProvider contentManagerProvider) : base(graphQlService)
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

			AddNavigationListField(name: "attachments", resolve: context => context.Source.Attachments);
			AddNavigationListField(name: "images",
				resolve: context =>
					context.Source.Attachments.Where(a => EamQuery.SupportedImageTypes.Contains(a.FileExtension)),
				includeNames: new[] {"Attachments"});

			AddNavigationListField(
				name: "content",
				resolve: context => contentManagerProvider.GetContentFiles("KSM", context.Source.Id).Result
				);
		}
	}
}
