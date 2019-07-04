using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class EquipmentAttachmentEfRule : EFRulesBase<EquipmentAttachment>
	{
		public override void AddRuleToModel(EntityTypeBuilder<EquipmentAttachment> entity)
		{
			entity
				.Property(w => w.EquipmentId)
				.HasConversion(v => v, v => v.PadRight(15));
			entity
				.HasOne(c => c.Equipment)
				.WithMany(e => e.Attachments)
				.HasForeignKey(w => w.EquipmentId);
		}
	}
}