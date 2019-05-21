using Microsoft.EntityFrameworkCore;

namespace ItGraphQlSchema.Types
{
	public sealed partial class CommonDbContext : DbContext
	{ 
		public DbSet<CartItem> CartItems { get; set; }

		public DbSet<Application> Applications { get; set; }
	}
}
