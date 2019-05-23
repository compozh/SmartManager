using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterValueRangeEfRule: EFRulesBase<ConditionParameterValueRange>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameterValueRange> entity)
		{
			entity
				.HasKey(c => new {c.ConditionParameterId, c.Id});
			entity
				.HasOne(c => c.Category)
				.WithMany()
				.HasForeignKey(c => c.WorkRequestCategoryId)
				.HasPrincipalKey(w => w.Id);
		}
	}
}