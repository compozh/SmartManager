using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ItGraphQlSchema.Types
{
	

	public class OrderDbContext : DbContext
	{
		public DbSet<Item> Items { get; set; }
		public DbSet<Order> Orders { get; set; }
		public DbSet<OrderItem> OrderItems { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
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
		
		static OrderDbContext()
		{
			var builder = new DbContextOptionsBuilder();
			builder.UseSqlServer(@"fake");

			using (var context = new OrderDbContext(builder.Options))
			{
				DataModel = context.Model;
			}
		}
		
		public OrderDbContext(DbContextOptions options) :
			base(options)
		{
		}
		
		public static IModel DataModel { get; }

	}


}