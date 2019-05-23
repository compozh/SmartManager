using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class TechnicalPlaceEfRule : EFRulesBase<TechnicalPlace>
	{
		public override void AddRuleToModel(EntityTypeBuilder<TechnicalPlace> entity)
		{
			entity
				.HasOne(c => c.Status)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.StatusId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(c => c.Category)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.CategoryId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(c => c.Level)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.LevelId)
				.HasPrincipalKey(p => p.Id);
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
			
			entity
				.Property(w => w.IsProductionLosses)
				.HasConversion(v => (short) (v ? 1 : 0), v => v == 1);
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}