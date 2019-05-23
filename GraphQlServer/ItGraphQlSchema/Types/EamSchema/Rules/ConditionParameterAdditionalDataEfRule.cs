using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterAdditionalDataEfRule: EFRulesBase<ConditionParameterAdditionalData>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameterAdditionalData> entity)
		{
			entity
				.HasOne(c => c.FailureReason)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.FailureReasonId)
				.HasPrincipalKey(w => w.Id);
			entity
				.HasOne(c => c.FailureType)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.FailureTypeId)
				.HasPrincipalKey(w => w.Id);
			entity
				.HasOne(c => c.Direction)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.DirectionId)
				.HasPrincipalKey(w => w.Id);
			entity
				.HasOne(c => c.SourceTechPlace)
				.WithMany()
				.HasForeignKey(c => c.SourceTechPlaceId);
			entity
				.HasOne(c => c.Responsible)
				.WithMany()
				.HasForeignKey(c => c.ResponsibleId);
			entity
				.Property(w => w.IsPlanned)
				.HasConversion(new DownTimeIsPlannedConverter());
			entity
				.Property(w => w.IsEmergency)
				.HasConversion(new DownTimeIsEmergencyConverter());
			entity
				.Property(w => w.IsEmergency)
				.HasConversion(new DownTimeIsEmergencyConverter());
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}