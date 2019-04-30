using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class SimpleDictionaryRecord
	{
		[Column("KOD_C")]
		public string Id { get; set; }
		
		[Column("KOD_N")]
		public int NumericId { get; set; }
		
		[Column("SPR")]
		public string Code { get; set; }

		[Column("NAIM")]
		public string Name { get; set; }

		[Column("NAIM_S")]
		public string ShortName { get; set; }
	}
}
