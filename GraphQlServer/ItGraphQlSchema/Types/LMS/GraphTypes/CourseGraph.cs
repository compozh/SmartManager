using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.LMS.Model;

namespace ItGraphQlSchema.Types.LMS.GraphTypes
{
	[AddInDI, GraphType(typeof(Course))]
	public class CourseGraph : EfObjectGraphType<Course>
	{
		public CourseGraph(IEfGraphQLService graphQLService) : base(graphQLService)
		{
			Name = "Course";

			Field(name: "courseId", c => c.Id).Description("Id");
			Field(name: "courseGuid", c => c.CourseGuid).Description("Идентификатор курса");
			Field(name: "name", c => c.Name).Description("Наименование курса");
			Field(name: "description", c => c.Description, nullable: true).Description("Описание курса");
			Field(name: "imageLink", c => c.ImageLink, nullable: true);
			Field(name: "backgroundColor", c => c.Color).Description("Цвет");
			Field<ListGraphType<FilterProperty>>(name: "rolesList", resolve: context => context.Source.RolesList);
			Field<ListGraphType<FilterProperty>>(name: "levelsList", resolve: context => context.Source.LevelsList);
			Field<ListGraphType<FilterProperty>>(name: "productsList", resolve: context => context.Source.ProductsList);
			Field<ListGraphType<FilterProperty>>(name: "tagsList", resolve: context => context.Source.TagsList);

			//Field(name: "rols", c => c.Roles, nullable: true).Description("Роли");
			//Field(name: "levels", c => c.DifficultyLevels, nullable: true).Description("Уровни сложности");
			//Field(name: "tags", c => c.Tags, nullable: true).Description("Тэги");
			//Field(name: "products", c => c.Product).Description("Продукты");
			//Field(c => c.IsFavorite);
			Field(c => c.Type);
			Field(c => c.ModulesQt);
			Field(c => c.ModulesQtLabel);
			Field(name: "durationMinutes", c => c.Duration);
			Field(name: "durationMinutesLabel", c => c.DurationLabel);

			AddNavigationListField(name: "Modules", resolve: context => context.Source.Modules);
			AddNavigationField(name: "Image", resolve: context => context.Source.Image);
		}
	}
}
