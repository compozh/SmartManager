using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.LMS.GraphTypes
{
	[AddInDI, GraphType(typeof(Lesson))]
	class LessonGraph : EfObjectGraphType<CommonDbContext, Lesson>
	{
		public LessonGraph(IEfGraphQLService<CommonDbContext> graphQLService): base(graphQLService)
		{
			Name = "Lesson";

			Field(name: "unitId", l => l.LessonId).Description("Id");
			Field(name: "lessonGuid", l => l.UniqIdentifier).Description("lessonGuid");
			Field(l => l.Name).Description("Название урока");
			Field(name: "durationMinutes" , l => l.Duration).Description("Длительность урока");
			Field(l => l.Description, nullable: true).Description("Описание урока");
			Field(l => l.Content, nullable: true).Description("Содержание урока");
			Field(l => l.OrderNumber).Description("Номер по порядку");

			AddNavigationField(name: "Module", resolve: context => context.Source.Module);
		}
	}
}
