using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("RZA")]
	public class WorkRequest
	{
		[Key, Column("UNRZA")]
		public int Id { get; set; }

		[Column("RMSG")]
		public string Content { get; set; }

		/// <summary>
		/// Код оборудования
		/// </summary>
		[Column("KROK")]
		public string EquipmentId { get; set; }
		public Equipment Equipment { get; set; }

		/// <summary>
		/// Код технического места
		/// </summary>
		[Column("UNRKP")]
		public int? TechnicalPlaceId { get; set; }
		public TechnicalPlace TechnicalPlace { get; set; }

		/// <summary>
		/// Код модели оборудования
		/// </summary>
		[Column("KMAT")]
		public string EquipmentModelId { get; set; }

		public Resource EquipmentModel { get; set; }

		[Column("DRZA")]
		public DateTime? CreationDate { get; set; }

		[Column("DATE_ISP")]
		public DateTime? StartDate { get; set; }

		[Column("DATE_END")]
		public DateTime? EndDate { get; set; }

		[Column("DIZG_F")]
		public DateTime? FactDate { get; set; }

		[Column("CEH")]
		public int? DepartmentId { get; set; }
		public Department Department { get; set; }

		[Column("CEH_EKSPL")]
		public int? ResponsibleDepartmentId { get; set; }
		public Department ResponsibleDepartment { get; set; }

		[Column("N_KDK_Z")]
		public string DeclarerEmployeeId { get; set; }
		public Employee DeclarerEmployee { get; set; }

		[Column("N_KDK")]
		public string ResponsibleEmployeeId { get; set; }
		public Employee ResponsibleEmployee { get; set; }

		[Column("N_KDK_OTV")]
		public string PerformerEmployeeId { get; set; }
		public Employee PerformerEmployee { get; set; }

		[Column("RZIST")]
		public WorkRequestSource Source { get; set; }

		[Column("STATUS")]
		public WorkRequestStatus Status { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; }

		[Column("RZNPR")]
		public string WorkRequestDirectionId { get; set; }
		public WorkRequestDirection Direction { get; set; }

		[Column("RZCAT")]
		public string WorkRequestCategoryId { get; set; }
		public WorkRequestCategory Category { get; set; }

//
//		[NotMapped]
//		/// <summary>
//		/// Карта ремонта
//		/// </summary>
//		public string RepairCard { get; set; }
//
		[Column("KRVR")]
		public string WorkRequestRepairTypeId { get; set; }
		public WorkRequestRepairType RepairType { get; set; }

		[Column("KOBJ")]
		public string ItObjectId { get; set; }
		public ItObject ItObject { get; set; }
	}
}
