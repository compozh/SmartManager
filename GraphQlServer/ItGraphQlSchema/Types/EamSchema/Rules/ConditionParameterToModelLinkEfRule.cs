using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterToModelLinkEfRule: EFRulesBase<ConditionParameterToModelLink>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameterToModelLink> entity)
		{
			entity
				.HasKey(c => new {c.ConditionParameterId, c.EquipmentModelId});
			entity
				.HasOne(ml => ml.EquipmentModel)
				.WithMany()
				.HasForeignKey(ml => ml.EquipmentModelId);
		}
	}
}