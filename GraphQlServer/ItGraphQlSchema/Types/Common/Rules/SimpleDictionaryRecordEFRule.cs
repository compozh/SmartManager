using ItGraphQlSchema.Types.EamSchema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class SimpleDictionaryRecordEFRule : EFRulesBase<SimpleDictionaryRecord>
	{
		public override void AddRuleToModel(EntityTypeBuilder<SimpleDictionaryRecord> entity)
		{
			entity
				.HasDiscriminator<string>("Code")
				.HasValue<WorkRequestCategory>("RZCAT")
				.HasValue<WorkRequestDirection>("RZNPR")
				.HasValue<WorkRequestRepairType>("RVR")
				.HasValue<TechnicalPlaceLevel>("RFSL")
				.HasValue<EquipmentStatus>("ROS")
				.HasValue<EquipmentCategory>("ROV")
				.HasValue<EquipmentFailureReason>("RFP")
				.HasValue<EquipmentFailureType>("RPD");
			
			entity.Property(w => w.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());

			entity.HasKey(s => new { s.Id, s.NumericId, s.Code });
		}
	}
}
