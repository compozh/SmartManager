using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class EquipmentEfRule : EFRulesBase<Equipment>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Equipment> entity)
		{
			entity
				.HasOne(c => c.Status)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.StatusId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(c => c.Category)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.CategoryId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(c => c.Type)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.TypeId);
			entity
				.HasOne(c => c.Model)
				.WithMany()
				.HasForeignKey(w => w.ModelId);
			entity
				.HasOne(c => c.ResponsibleEmployee)
				.WithMany()
				.HasForeignKey(w => w.ResponsibleEmployeeId);
			entity
				.HasOne(c => c.Department)
				.WithMany()
				.HasForeignKey(w => w.DepartmentId);
			entity
				.HasOne(c => c.ItObject)
				.WithMany()
				.HasForeignKey(w => w.ItObjectId);
		}
	}
}