using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ItGraphQlSchema.Types
{
	

	public sealed partial class CommonDbContext : DbContext
	{
		public DbSet<Item> Items { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<OrderItem> OrderItems { get; set; }

		protected void testOnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<OrderItem>()
				.HasKey(i => new {  i.ItemId, i.OrderId });

			modelBuilder.Entity<OrderItem>()
				.HasOne(oi => oi.Order)
				.WithMany(i => i.ItemsLink)
				.HasForeignKey(oi => oi.OrderId);
			modelBuilder.Entity<OrderItem>()
				.HasOne(oi => oi.Item)
				.WithMany(i => i.OrdersLink)
				.HasForeignKey(oi => oi.ItemId);

			
				
		}

	}


}