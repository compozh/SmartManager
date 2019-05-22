using ItGraphQlSchema.Types.Common;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("ROT")]
	public class EquipmentType
	{
		/// <summary>
		/// Код
		/// </summary>
		[Key, Column("KROT")]
		public string Id { get; set; }

		/// <summary>
		/// Наименование
		/// </summary>
		[Column("NROT")]	
		public string Name { get; set; }
		
		[Column("SKM_OBJ")]
		public string ModelGroupId { get; set; }
		public ResourceGroup ModelGroup { get; set; }
		
		public List<Equipment> Equipments { get; set; }
	}
}
