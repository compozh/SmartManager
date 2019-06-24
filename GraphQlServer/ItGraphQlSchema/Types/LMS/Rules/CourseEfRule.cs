using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.LMS.Rules
{
	[EFRule]
	class CourseEfRule : EFRulesBase<Course>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Course> entity)
		{
			entity.Property(c => c.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity
				.HasOne(c => c.Image)
				.WithMany()
				.HasForeignKey(c => c.ImageCode);

			entity
				.Property(c => c.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}
