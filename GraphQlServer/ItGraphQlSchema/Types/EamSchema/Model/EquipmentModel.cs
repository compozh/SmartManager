using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("KSM")]
	public class EquipmentModel
	{
		/// <summary>
		/// Код
		/// </summary>
		[Key, Column("KMAT")]
		public string Id { get; set; }

		[Column("SKM")]
		public string ModelGroupId { get; set; }
		public EquipmentModelGroup ModelGroup { get; set; }

		/// <summary>
		/// Наименование
		/// </summary>
		[Column("NMAT")]
		public string Name { get; set; }
		
		[Column("NAIMKM_S")]
		public string Designation { get; set; }
		
		[Column("N_RES")]
		public string FullName { get; set; }
		
		[Column("KKST")]
		public string ResourceTypeId { get; set; }
		
		public List<WorkRequest> WorkRequests { get; set; }
		public List<TechnicalPlace> TechnicalPlaces { get; set; }
		public List<Equipment> Equipments { get; set; }
	}
}
