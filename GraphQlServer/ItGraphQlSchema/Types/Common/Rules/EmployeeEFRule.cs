using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class EmployeeEFRule : EFRulesBase<Employee>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Employee> entity)
		{
			entity.HasOne(c => c.ItObject)
				.WithMany(o => o.Employees)
				.HasForeignKey(c => c.ItObjectId);

			entity.HasOne(c => c.ItObject)
				.WithMany(o => o.Employees)
				.HasForeignKey(c => c.ItObjectId);
		}
	}
}
