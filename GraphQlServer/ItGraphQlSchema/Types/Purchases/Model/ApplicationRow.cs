using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Purchases
{
	public class ApplicationRow
	{
		[Key, Column("ID")]
		public int Id { get; set; }
	}
}
