using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Common
{
	[Table("TAPEI")]
	public class MeasurementUnit
	{
		[Key, Column("EDI")]
		public short Id { get; set; }

		[Column("NEDI")]
		public string Name { get; set; }
		
		[Column("PNEDI")]
		public string FullName { get; set; }
		
		[Column("SNEDI")]
		public string ShortName { get; set; }
		
		[Column("PR_DO")]
		public bool IsValid { get; set; }
	}
}