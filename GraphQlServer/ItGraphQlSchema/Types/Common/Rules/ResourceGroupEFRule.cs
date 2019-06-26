using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class ResourceGroupEFRule : EFRulesBase<ResourceGroup>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ResourceGroup> entity)
		{
			entity
				.HasOne(r => r.Parent)
				.WithMany(r => r.Children)
				.HasForeignKey(r => r.ParentId);
		}
	}
}
