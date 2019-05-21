using GraphQL.EntityFramework;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(ResourceGroup))]
	public class ResourceGroupGraph : EfObjectGraphType<ResourceGroup>
	{
		public ResourceGroupGraph(IEfGraphQLService graphQlService) : base(graphQlService)
		{
			Name = "ResouceGroup";
			Field(x => x.Id).Description("Идентификатор");
			Field(x => x.Name).Description("Наименование");
			Field(x => x.ParentId).Description("Код предка");
			//Field(x => x.Icon).Description("Иконка");

			AddNavigationField(
				name: "parentGroup",
				resolve: context => context.Source.Parent)
				.Description = "Предок";

			AddNavigationListField(
				name: "resources",
				resolve: context => context.Source.Resources);

			AddNavigationConnectionField(
				name: "resourcesConnection",
				resolve: context => context.Source.Resources,
				includeNames: new[] { "Resources" });
		}
	}
}
