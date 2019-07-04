using System;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class WorkRequestAttachmentEfRule : EFRulesBase<WorkRequestAttachment>
	{
		public override void AddRuleToModel(EntityTypeBuilder<WorkRequestAttachment> entity)
		{
			entity
				.Property(w => w.WorkRequestId)
				.HasConversion(v => v.ToString(), v => Convert.ToInt32(v.Trim()));
			entity
				.HasOne(c => c.WorkRequest)
				.WithMany(e => e.Attachments)
				.HasForeignKey(w => w.WorkRequestId);
		}
	}
}