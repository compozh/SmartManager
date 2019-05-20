using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types
{
	[Table("_GQORDER")]
	public class Order
	{
		[Key, Column("ID")]
		public int Id { get; set; }
		[Column("NAME")]
		public string Name { get; set; }
		[ForeignKey("OrderId")]
		public List<OrderItem> ItemsLink { get; set; }
	}
}
