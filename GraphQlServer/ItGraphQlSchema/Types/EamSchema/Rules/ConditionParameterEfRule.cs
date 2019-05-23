using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterEfRule : EFRulesBase<ConditionParameter>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameter> entity)
		{
			entity
				.HasOne(c => c.ConditionParameterType)
				.WithMany(t => t.ConditionParameters)
				.HasForeignKey(c => c.ConditionParameterTypeId);
			entity
				.HasOne(c => c.MeasurementUnit)
				.WithMany()
				.HasForeignKey(c => c.MeasurementUnitId);
			entity
				.HasMany(c => c.ValueRanges)
				.WithOne(t => t.ConditionParameter)
				.HasForeignKey(c => c.ConditionParameterId);
			entity
				.HasMany(c => c.ModelLinks)
				.WithOne(ml => ml.ConditionParameter)
				.HasForeignKey(c => c.ConditionParameterId);
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}