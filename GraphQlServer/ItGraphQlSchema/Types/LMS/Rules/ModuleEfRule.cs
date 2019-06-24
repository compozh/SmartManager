using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.LMS.Rules
{
	[EFRule]
	class ModuleEfRule : EFRulesBase<Module>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Module> entity)
		{
			entity.Property(m => m.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity
				.HasOne(m => m.Image)
				.WithMany()
				.HasForeignKey(m => m.ImageCode);

			entity
				.Property(m => m.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}
