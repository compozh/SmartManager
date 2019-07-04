using ItGraphQlSchema.Types.LMS;
using Microsoft.EntityFrameworkCore;

namespace ItGraphQlSchema.Types
{
	public partial class CommonDbContext
	{
		public DbSet<Course> Courses { get; set; }
		public DbSet<Module> Modules { get; set; }
		public DbSet<ModuleCourses> ModuleCourses { get; set; }
		public DbSet<Lesson> Lessons { get; set; }
	}
}
