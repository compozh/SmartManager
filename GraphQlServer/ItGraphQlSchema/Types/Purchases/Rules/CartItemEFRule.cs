using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Purchases.Rules
{
	[EFRule]
	class CartItemEFRule : EFRulesBase<CartItem>
	{
		public override void AddRuleToModel(EntityTypeBuilder<CartItem> entity)
		{
			entity.HasOne(p => p.MeasurementUnit)
				.WithMany()
				.HasForeignKey(p => p.MeasurementUnitId);
			entity.HasOne(p => p.Resource)
				.WithMany()
				.HasForeignKey(p => p.ResourceId);
			entity.Property(e=>e.UserId).HasConversion(p=>p.TrimEnd(),p=>p.TrimEnd());
		}
	}
}
