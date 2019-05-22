using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class MeasurementUnitEFRule : EFRulesBase<MeasurementUnit>
	{
		public override void AddRuleToModel(EntityTypeBuilder<MeasurementUnit> entity)
		{
			entity.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}
