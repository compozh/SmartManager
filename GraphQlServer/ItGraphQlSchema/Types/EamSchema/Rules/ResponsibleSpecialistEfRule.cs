using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class ResponsibleSpecialistEfRule: EFRulesBase<ResponsibleSpecialist>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ResponsibleSpecialist> entity)
		{
			entity
				.HasOne(c => c.Employee)
				.WithMany()
				.HasForeignKey(c => c.EmployeeId);
			entity
				.HasOne(c => c.TechnicalPlace)
				.WithMany(tp => tp.ResponsibleSpecialists)
				.HasForeignKey(c => c.TechnicalPlaceId);
			entity
				.HasOne(c => c.Direction)
				.WithMany(d => d.ResponsibleSpecialists)
				.HasForeignKey(c => c.DirectionId)
				.HasPrincipalKey(d => d.Id);
			entity
				.Property(w => w.IsResponsible)
				.HasConversion(v => v ? "+" : string.Empty, v => !string.IsNullOrWhiteSpace(v));
		}
	}
}