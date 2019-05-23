using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.EamSchema.Rules
{
	[EFRule]
	public class WorkRequestEfRule : EFRulesBase<WorkRequest>
	{
		public override void AddRuleToModel(EntityTypeBuilder<WorkRequest> entity)
		{
			entity
				.HasOne(p => p.Category)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestCategoryId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(p => p.Direction)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestDirectionId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(p => p.RepairType)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestRepairTypeId)
				.HasPrincipalKey(p => p.Id);
			entity
				.HasOne(c => c.DeclarerEmployee)
				.WithMany()
				.HasForeignKey(w => w.DeclarerEmployeeId);
			entity
				.HasOne(c => c.ResponsibleEmployee)
				.WithMany()
				.HasForeignKey(w => w.ResponsibleEmployeeId);
			entity
				.HasOne(c => c.PerformerEmployee)
				.WithMany()
				.HasForeignKey(w => w.PerformerEmployeeId);
			entity
				.HasOne(c => c.Equipment)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.EquipmentId);
			entity
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.TechnicalPlaceId);
			entity
				.HasOne(c => c.EquipmentModel)
				.WithMany()
				.HasForeignKey(w => w.EquipmentModelId);
			entity
				.HasOne(c => c.Department)
				.WithMany()
				.HasForeignKey(w => w.DepartmentId);
			entity
				.HasOne(c => c.ItObject)
				.WithMany()
				.HasForeignKey(w => w.ItObjectId);
			
			
			entity
				.Property(w => w.WorkRequestCategoryId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			entity
				.Property(w => w.WorkRequestDirectionId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			entity
				.Property(w => w.WorkRequestRepairTypeId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			entity
				.Property(w => w.Source)
				.HasConversion(new EnumValueConverter<WorkRequestSource, string>());
			entity
				.Property(w => w.Status)
				.HasConversion(new EnumValueConverter<WorkRequestStatus, string>());
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}