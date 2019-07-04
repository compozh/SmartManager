using ItGraphQlSchema.Types.Purchases;
using Microsoft.EntityFrameworkCore;

namespace ItGraphQlSchema.Types
{
	public partial class CommonDbContext
	{ 
		public DbSet<CartItem> CartItems { get; set; }
	}
}
