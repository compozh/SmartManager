using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("RKPROK")]
	public class EquipmentMovementHistory
	{
		[Key, Column("ID")]
		public decimal Id { get; set; }	

		[Column("KROK")]
		public string EquipmentId { get; set; }	
		public Equipment Equipment { get; set; }
		
		[Column("UNRKP")]
		public int? TechnicalPlaceId { get; set; }	
		public TechnicalPlace TechnicalPlace { get; set; }
		
		[Column("DATEFROM")]
		public DateTime? StartDate { get; set; }	
		
		[Column("DATETO")]
		public DateTime? EndDate { get; set; }	
	}
}