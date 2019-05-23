using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ConditionParameterValueEfRule : EFRulesBase<ConditionParameterValue>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ConditionParameterValue> entity)
		{
			entity
				.HasOne(c => c.AdditionalData)
				.WithOne(a => a.ConditionParameterValue)
				.HasForeignKey<ConditionParameterAdditionalData>(c => c.Id);
			entity
				.HasOne(c => c.Equipment)
				.WithMany()
				.HasForeignKey(c => c.EquipmentId);
			entity
				.HasOne(c => c.TechnicalPlace)
				.WithMany()
				.HasForeignKey(c => c.TechnicalPlaceId);
			entity
				.HasOne(c => c.EquipmentModel)
				.WithMany()
				.HasForeignKey(c => c.EquipmentModelId);
			entity
				.HasOne(c => c.Department)
				.WithMany()
				.HasForeignKey(c => c.DepartmentId);
			entity
				.HasOne(c => c.ConditionParameter)
				.WithMany()
				.HasForeignKey(c => c.ConditionParameterId);
			entity
				.HasOne(c => c.MeasurementUnit)
				.WithMany()
				.HasForeignKey(c => c.MeasurementUnitId);
		}
	}
}