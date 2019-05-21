using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.EamSchema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[Table("KSM")]
	public class Resource
	{
		[Key, Column("KMAT")]
		public string Id { get; set; }
		[Column("SKM")]
		public string ResourceGroupId { get; set; }

		public ResourceGroup ResourceGroup { get; set; }
		/// <summary>
		/// Наименование
		/// </summary>
		[Column("NMAT")]
		public string Name { get; set; }

		[Column("NAIMKM_S")]
		public string Designation { get; set; }

		[Column("N_RES")]
		public string FullName { get; set; }

		[Column("EDI")]
		public short? MeasurementUnitId { get; set; }

		public MeasurementUnit MeasurementUnit { get; set; }

		[Column("KKST")]
		public string ResourceTypeId { get; set; }
	}
}
