using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common.Rules
{
	[EFRule]
	class ImageEFRule : EFRulesBase<Image>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Image> entity)
		{
			entity.Property(i => i.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity.Property(i => i.Name)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
		}
	}
}
