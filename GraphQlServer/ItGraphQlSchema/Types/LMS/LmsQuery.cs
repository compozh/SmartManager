using System.Linq;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.LMS;
using ItGraphQlSchema.Types.LMS.Model;

namespace ItGraphQlSchema.Types
{
	[AddInDI]
	class LmsQuery : QueryGraphType<CommonDbContext>
	{
		private readonly ILmsDataProvider _dataProvider;

		public LmsQuery(IEfGraphQLService<CommonDbContext> efGraphQLService, ILmsDataProvider dataProvider) : base(efGraphQLService)
		{
			_dataProvider = dataProvider;

			Name = "LmsQuery";
			
			Field<AvailableFilters>(name: "availableFilters", resolve: context => _dataProvider.GetAvailableFilters());

			AddQueryField(name: "courses", resolve: context => _dataProvider.Courses);

			AddQueryField(name: "images", resolve: context => _dataProvider.Images);

			AddQueryField(name: "modules", resolve: context => _dataProvider.Modules);

			AddQueryField(name: "moduleCourses", resolve: context => _dataProvider.ModuleCourses);

			AddQueryField(name: "lessons", resolve: context => _dataProvider.Lessons);
		}
	}
}
