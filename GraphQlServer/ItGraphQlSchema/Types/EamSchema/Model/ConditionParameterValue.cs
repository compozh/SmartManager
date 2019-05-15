using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("PRZ")]
	public class ConditionParameterValue
	{
		[Key, Column("ID")]
		public decimal Id { get; set; }
		
		[Column("ZPRX")]
		public decimal Value { get; set; }

		[Column("DPRZ")]
		public  DateTime? Date { get; set; }
		
		[Column("ZPRXT")]
		public DateTime? EndDate { get; set; }
		
		[Column("KMAT")]
		public  string EquipmentModelId { get; set; }
		public EquipmentModel EquipmentModel { get; set; }

		[Column("KROK")]
		public  string EquipmentId { get; set; }
		public Equipment Equipment { get; set; }

		[Column("UNRKP")]
		public  int? TechnicalPlaceId { get; set; }
		public TechnicalPlace TechnicalPlace { get; set; }

		[Column("CEHSSM")]
		public  int? DepartmentId { get; set; }
		public Department Department { get; set; }

		[Column("TXTNESOOTV")]
		public string Description { get; set; }
		
		[Column("COMM")]
		public string Comment { get; set; }

		[Column("KPRXU")]
		public decimal? ConditionParameterId { get; set; }
		public ConditionParameter ConditionParameter { get; set; }
		
		[Column("EDI")]
		public short? MeasurementUnitId { get; set; }
		public MeasurementUnit MeasurementUnit { get; set; }
		
		public ConditionParameterAdditionalData AdditionalData { get; set; }
	}
}