using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types
{
	public class Order
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string IdOrderItem { get; set; }
	}
}
