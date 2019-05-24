using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class ResourceGroupEFRule : EFRulesBase<ResourceGroup>
	{
		public override void AddRuleToModel(EntityTypeBuilder<ResourceGroup> entity)
		{
			entity.HasOne(resourceGroup => resourceGroup.Parent)
				.WithMany()
				.HasForeignKey(resourceGroup => resourceGroup.ParentId);
		}
	}
}
