using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types
{
	[Table("_GQITEM")]
	public class Item
	{
		[Key, Column("ID")]
		public int Id { get; set; }
		[Column("NAME")]
		public string Name { get; set; }
		
		[ForeignKey("ItemId")]
		public List<OrderItem> OrdersLink { get; set; }
	}
}
