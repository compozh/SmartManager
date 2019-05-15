using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("QCD")]
	public class ConditionParameterValueRange
	{
		[Column("QCD_ID")]
		public short Id { get; set; }

		[Column("KPRXU")]
		public decimal ConditionParameterId { get; set; }
		public ConditionParameter ConditionParameter { get; set; }
		
		[Column("ZPRX_MIN")]
		public decimal MinValue { get; set; }

		[Column("ZPRX_MAX")]
		public decimal MaxValue { get; set; }
		
		[Column("RZCAT")]
		public string WorkRequestCategoryId { get; set; }
		public WorkRequestCategory Category { get; set; }
		
		[Column("BCOLOR")]
		public string Color { get; set; }
		
		[Column("TXTZPRXIN")]
		public string Description { get; set; }
	}
}