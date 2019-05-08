using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[Table("POD")]
	public class Department
	{
		[Key, Column("CEH")]
		public int Id { get; set; }

		[Column("NAIM_P")]
		public string Name { get; set; }
	}
}
