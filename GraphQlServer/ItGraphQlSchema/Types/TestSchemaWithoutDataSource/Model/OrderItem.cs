using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types
{
	[Table("_GQORIT")]
	public class OrderItem
	{
		[Column("ORDERID")]
		public int OrderId { get; set; }
		public Order Order { get; set; }
		[Column("ITEMID")]
		public int ItemId { get; set; }
		public Item Item { get; set; }

		[Column("COUNT")]
		public int Count { get; set; }
		
		
	}
}
