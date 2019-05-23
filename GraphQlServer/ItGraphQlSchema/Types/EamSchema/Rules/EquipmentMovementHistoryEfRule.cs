using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class EquipmentMovementHistoryEfRule : EFRulesBase<EquipmentMovementHistory>
	{
		public override void AddRuleToModel(EntityTypeBuilder<EquipmentMovementHistory> entity)
		{
			entity
				.HasOne(c => c.Equipment)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.EquipmentId);
			entity
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.TechnicalPlaceId);
		}
	}
}