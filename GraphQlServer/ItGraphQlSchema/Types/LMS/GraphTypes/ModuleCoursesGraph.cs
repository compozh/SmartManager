using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.LMS.GraphTypes
{
	[AddInDI, GraphType(typeof(ModuleCourses))]
	class ModuleCoursesGraph : EfObjectGraphType<ModuleCourses>
	{
		public ModuleCoursesGraph(IEfGraphQLService graphQLService): base(graphQLService)
		{
			Name = "ModuleCourses";

			Field(mc => mc.CourseId).Description("");
			Field(mc => mc.ModuleId).Description("");
			Field(mc => mc.OrderNumber).Description("");
			Field(mc => mc.StepId).Description("");

			AddNavigationField(name: "Course", resolve: context => context.Source.Course);
			AddNavigationField(name: "Module", resolve: context => context.Source.Module);
		}
	}
}
