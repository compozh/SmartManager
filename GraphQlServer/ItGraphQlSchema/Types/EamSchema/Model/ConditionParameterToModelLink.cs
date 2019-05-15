using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("PRXP")]
	public class ConditionParameterToModelLink
	{
		[Column("KMAT")]
		public  string EquipmentModelId { get; set; }
		public EquipmentModel EquipmentModel { get; set; }

		[Column("KPRXU")]
		public decimal ConditionParameterId { get; set; }
		public ConditionParameter ConditionParameter { get; set; }
	}
}