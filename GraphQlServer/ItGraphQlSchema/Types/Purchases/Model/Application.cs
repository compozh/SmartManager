using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types
{
	[Table("DMZ")]
	public class Application
	{
		[Key, Column("UNDOC")]
		public int UniqueNumber { get; set; }
		[Column("NDM")]
		public string Number { get; set; }
		[Column("DDM")]
		public DateTime Date { get; set; }
	}
}
