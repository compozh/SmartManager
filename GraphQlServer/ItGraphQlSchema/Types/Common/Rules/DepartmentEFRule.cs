using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class DepartmentEFRule : EFRulesBase<Department>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Department> entity)
		{
			entity.HasOne(c => c.ItObject)
				.WithMany(o => o.Departments)
				.HasForeignKey(c => c.ItObjectId);
			entity
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
		}
	}
}