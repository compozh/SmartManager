using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("PRZD")]
	public class ConditionParameterAdditionalData
	{
		[Key, Column("ID")]
		public decimal Id { get; set; }
		
		[Column("KRPD")]
		public string FailureTypeId { get; set; }
		public EquipmentFailureType FailureType { get; set; }

		[Column("KRFP")]
		public string FailureReasonId { get; set; }
		public EquipmentFailureReason FailureReason { get; set; }

		[Column("RZNPR")]
		public string DirectionId { get; set; }
		public WorkRequestDirection Direction { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; }
		
		[Column("UNRKP_SRC")]
		public  int? SourceTechPlaceId { get; set; }
		public TechnicalPlace SourceTechPlace { get; set; }
		
		[Column("N_KDK_Z")]
		public string ResponsibleId { get; set; }
		public Employee Responsible { get; set; }

		[Column("TDOWNTIME")]
		public string DownTimeType { get; set; }

		[Column("PRDOWNTIME")]
		public bool IsPlanned { get; set; }

		[Column("EMERGENCY")]
		public bool IsEmergency { get; set; }
		
		public ConditionParameterValue ConditionParameterValue { get; set; }
	}
	
	public class DownTimeIsPlannedConverter : ValueConverter<bool, string>
	{
		public DownTimeIsPlannedConverter() : base(v =>  v ? "P" : "N",
			v => !string.IsNullOrWhiteSpace(v) && v == "P")
		{
		}
	}
	
	public class DownTimeIsEmergencyConverter : ValueConverter<bool, short>
	{
		public DownTimeIsEmergencyConverter() : base(v =>  (short)(v ? 1 : 0),
			v => v == 1)
		{
		}
	}
}