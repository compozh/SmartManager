using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class ResourceEFRule : EFRulesBase<Resource>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Resource> entity)
		{
			entity.HasOne(c => c.MeasurementUnit)
				.WithMany()
				.HasForeignKey(c => c.MeasurementUnitId);

			entity.HasOne(resource => resource.ResourceGroup)
				.WithMany(resourceGroup => resourceGroup.Resources)
				.HasForeignKey(resource => resource.ResourceGroupId);
		}
	}
}
