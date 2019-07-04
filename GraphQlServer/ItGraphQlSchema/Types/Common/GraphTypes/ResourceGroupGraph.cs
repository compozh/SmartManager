using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDI, GraphType(typeof(ResourceGroup))]
	public class ResourceGroupGraph : EfObjectGraphType<CommonDbContext, ResourceGroup>
	{
		public ResourceGroupGraph(IEfGraphQLService<CommonDbContext> graphQlService, IContentManagerProvider contentManagerProvider) : base(graphQlService)
		{
			Name = "ResouceGroup";
			Field(x => x.Id).Description("Идентификатор");
			Field(x => x.Name).Description("Наименование");
			Field(x => x.ParentId).Description("Код предка");
			Field(x => x.Icon, nullable: true).Description("Иконка");

			AddNavigationField(
				name: "parent",
				resolve: context => context.Source.Parent)
				.Description = "Родительская группа";

			AddNavigationListField(
				name: "children",
				resolve: context => context.Source.Children)
				.Description = "Подгруппы";

			AddNavigationListField(
				name: "resources",
				resolve: context => context.Source.Resources);

			AddNavigationConnectionField(
				name: "resourcesConnection",
				resolve: context => context.Source.Resources,
				includeNames: new[] { "Resources" });

			AddNavigationListField(
				name: "content",
				resolve: context => contentManagerProvider.GetContentFiles("SKM", context.Source.Id).Result
				);

		}
	}
}
