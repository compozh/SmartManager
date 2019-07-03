using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.LMS.GraphTypes
{
	[AddInDI, GraphType(typeof(Module))]
	public class ModuleGraph : EfObjectGraphType<CommonDbContext, Module>
	{
		public ModuleGraph(IEfGraphQLService<CommonDbContext> graphQLService): base(graphQLService)
		{
			Name = "Module";

			Field(name: "moduleId", m => m.Id).Description("Идентфикатор модуля");
			Field(name: "moduleGuid", m => m.UniqIdentifier).Description("Идентификатор");
			Field(m => m.Name).Description("Наименование модуля");
			Field(m => m.Description, nullable: true).Description("Описание модуля");
			Field(m => m.ImageLink, nullable: true);
			Field(m => m.Duration);
			Field(m => m.DurationLabel);
			Field(m => m.ShowLessonsTitle);
			Field(name: "backgroundColor", m => m.Color).Description("Цвет");
			Field(m => m.OrderNumber).Description("Номер по порядку");

			Field(m => m.Roles, nullable: true).Description("Роли");
			Field(m => m.DifficultyLevels, nullable: true).Description("Уровни сложности");
			Field(m => m.Product).Description("Продукты");
			Field(m => m.Tags, nullable: true).Description("Тэги");

			Field<ListGraphType<FilterProperty>>(name: "rolesList", resolve: context => context.Source.RolesList);
			Field<ListGraphType<FilterProperty>>(name: "levelsList", resolve: context => context.Source.LevelsList);
			Field<ListGraphType<FilterProperty>>(name: "productsList", resolve: context => context.Source.ProductsList);
			Field<ListGraphType<FilterProperty>>(name: "tagsList", resolve: context => context.Source.TagsList);

			AddNavigationListField(name: "Courses", resolve: context => context.Source.Courses);
			AddNavigationListField(name: "Lessons", resolve: context => context.Source.Lessons);
			AddNavigationField(name: "Image", resolve: context => context.Source.Image);
		}
	}
}
