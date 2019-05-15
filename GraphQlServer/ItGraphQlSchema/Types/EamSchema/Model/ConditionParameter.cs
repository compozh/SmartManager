using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("PRX")]
	public class ConditionParameter
	{
		[Key, Column("KPRXU")]
		public decimal Id { get; set; }

		[Column("KPRX")]
		public string Code { get; set; }

		[Column("NPRX")]
		public string Name { get; set; }
		
		[Column("KMAT")]
		public string ResourceCodeMask { get; set; }

		[Column("EDI")]
		public short? MeasurementUnitId { get; set; }
		public MeasurementUnit MeasurementUnit { get; set; }

		[Column("PERIOD")]
		public decimal? Period { get; set; }

		[Column("ZPRX_MIN")]
		public decimal? MinValue { get; set; }

		[Column("ZPRX_MAX")]
		public decimal? MaxValue { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; } 

		[Column("RCMFORE")]
		public string RcmForecast { get; set; }

		[Column("KPRQV")]
		public string ConditionParameterTypeId { get; set; }
		public ConditionParameterType ConditionParameterType { get; set; }
		
		public List<ConditionParameterValueRange> ValueRanges { get; set; }
		
		public List<ConditionParameterToModelLink> ModelLinks { get; set; }
 	}
}