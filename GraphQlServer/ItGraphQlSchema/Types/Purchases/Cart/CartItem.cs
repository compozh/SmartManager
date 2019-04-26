using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types
{
	public class CartItem
	{
		public int Id { get; set; }
		public string ResourceId { get; set; }
		public string ResourceName { get; set; }
		public decimal Quantity { get; set; }
		public string MeasureUnit { get; set; }
		public DateTime DateDelivery { get; set; }
	}
}
