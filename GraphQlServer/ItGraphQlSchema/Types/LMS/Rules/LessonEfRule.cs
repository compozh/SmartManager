using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.LMS.Rules
{
	[EFRule]
	public class LessonEfRule : EFRulesBase<Lesson>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Lesson> entity)
		{
			entity
				.HasKey(l => new { l.LessonId, l.ModuleId });

			entity.Property(l => l.LessonId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity.Property(l => l.ModuleId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity
				.HasOne(l => l.Module)
				.WithMany(m => m.Lessons)
				.HasForeignKey(l => l.ModuleId);

			entity
				.Property(l => l.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}
