using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[Table("DMS")]
	public class DocumentRow
	{
		[Key, Column("UNDOC", Order = 0)]
		public int DocumentId { get; set; }
		public Document Document { get; set; }

		[Key, Column("NPP", Order = 1)]
		public int Id { get; set; }

		[Column("KMAT")]
		public string ResourceId { get; set; }

		[GraphTypeFK(new[] { "ResourceId" })]
		public Resource Resource { get; set; }

		[Column("EDI")]
		public short? MeasurementUnitId { get; set; }

		[GraphTypeFK(new[] { "MeasurementUnitId" })]
		public MeasurementUnit MeasurementUnit { get; set; }

		[Column("DLIM")]
		public DateTime? OrderDate { get; set; }

		[Column("DLIM2")]
		public DateTime? AdditionalDate2 { get; set; }

		[Column("KOL_P")]
		public decimal PlanQuantity { get; set; }

		[Column("KOL")]
		public decimal Quantity { get; set; }

		[Column("FIO_D")]
		public string CreationUserId { get; set; }

		[Column("FIO_O")]
		public string EditUserId { get; set; }

		[Column("DATE_D")]
		public DateTime? CreationDate { get; set; }

		[Column("DATE_K")]
		public DateTime? EditDate { get; set; }
	}
}
