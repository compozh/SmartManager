using ItGraphQlSchema.Types.Common;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Purchases
{
	[Table("CART")]
	public class CartItem
	{
		[Key, Column("ID")]
		//[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid Id { get; set; }

		[Column("USERID")]
		public string UserId { get; set; }

		[Column("KMAT")]
		public string ResourceId { get; set; }

		public Resource Resource { get; set; }

		[Column("NAIM")]
		public string ResourceName { get; set; }

		[Column("KOL")]
		public decimal Quantity { get; set; }

		[Column("EDI")]
		public short? MeasurementUnitId { get; set; }

		public MeasurementUnit MeasurementUnit { get; set; }

		[Column("DTDELIV")]
		public DateTime? DateDelivery { get; set; }

		[Column("FIO_D")]
		public string SignatureUserId { get; set; }

		[Column("DATE_D")]
		public DateTime? SignatureDate { get; set; }
	}
}
