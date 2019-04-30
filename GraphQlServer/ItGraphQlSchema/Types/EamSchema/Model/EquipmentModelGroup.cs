using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("SKM")]
	public class EquipmentModelGroup
	{
		[Key, Column("SKM")]
		public string Id { get; set; }

		[Column("SKMNAIM")]
		public string Name { get; set; }
		
		[Column("SKM_PR")]
		public string ParentId { get; set; }
		public EquipmentModelGroup Parent { get; set; }
		
		/// <summary>
		/// Иконка
		/// </summary>
		[Column("ICON")]
		public string Icon { get; set; }
		
		public List<EquipmentModel> EquipmentModels { get; set; }
		public EquipmentType EquipmentType { get; set; }
	}
}