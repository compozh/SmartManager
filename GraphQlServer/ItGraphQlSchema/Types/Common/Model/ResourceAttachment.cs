using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	public class ResourceAttachment : Attachment
	{
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual string Key { get; set; }
		
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual string ResourceId { get; set; }
		public virtual Resource Resource { get; set; }
	}
	
	[EFRule]
	public class EquipmentAttachmentEfRule : EFRulesBase<ResourceAttachment>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ResourceAttachment> entity)
		{
			entity
				.Property(w => w.ResourceId)
				.HasConversion(v => v, v => v.PadRight(15));
			entity
				.HasOne(c => c.Resource)
				.WithMany(e => e.Attachments)
				.HasForeignKey(w => w.ResourceId);
		}
	}
}