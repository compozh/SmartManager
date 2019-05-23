using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterTypeEfRule : EFRulesBase<ConditionParameterType>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameterType> entity)
		{
			entity
				.HasOne(c => c.WorkRequestDirection)
				.WithMany(t => t.ConditionParameterTypes)
				.HasForeignKey(c => c.WorkRequestDirectionId)
				.HasPrincipalKey(w => w.Id);
			entity
				.Property(w => w.ParameterGroup)
				.HasConversion(new EnumValueConverter<ConditionParameterGroup, string>());
		}
	}
}