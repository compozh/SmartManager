using ItGraphQlSchema.Types.EamSchema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class AttachmentEFRule : EFRulesBase<Attachment>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Attachment> entity)
		{
			entity.HasOne(c => c.ItObject)
				.WithMany()
				.HasForeignKey(c => c.ItObjectId);
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
			entity
				.Property(w => w.IsActive)
				.HasConversion(v => v ? 1 : 0, v => v == 1);
			entity
				.HasDiscriminator<string>("Alias")
				.HasValue<EquipmentAttachment>("ROK")
				.HasValue<WorkRequestAttachment>("RZA")
				.HasValue<ResourceAttachment>("KSM");
		}
	}
}