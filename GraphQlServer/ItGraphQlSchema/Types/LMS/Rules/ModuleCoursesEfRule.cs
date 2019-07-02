using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.LMS.Rules
{
	[EFRule]
	class ModuleCoursesEfRule : EFRulesBase<ModuleCourses>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ModuleCourses> entity)
		{
			entity.HasKey(mc => new { mc.CourseId, mc.ModuleId });

			entity
				.HasOne(mc => mc.Course)
				.WithMany(c => c.Modules)
				.HasForeignKey(mc => mc.CourseId);

			entity
				.HasOne(mc => mc.Module)
				.WithMany(m => m.Courses)
				.HasForeignKey(mc => mc.ModuleId);
		}
	}
}
