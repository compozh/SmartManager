using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("RKP")]
	public class TechnicalPlace
	{
		/// <summary>
		/// Код технического места
		/// </summary>
		[Key, Column("UNRKP")]
		public int Id { get; set; }		

		/// <summary>
		/// Код модели оборудования
		/// </summary>
		[Column("KMAT_ROK")]
		public string ModelId { get; set; }
		public Resource Model { get; set; }	

		/// <summary>
		/// Уровень технического места
		/// </summary>
		[Column("KRFSL")]
		public string LevelId { get; set; }
		public TechnicalPlaceLevel Level { get; set; }

		/// <summary>
		/// Табельный номер ответственного
		/// </summary>
		[Column("N_KDK")]
		public string ResponsibleEmployeeId { get; set; }
		public Employee ResponsibleEmployee { get; set; }

		/// <summary>
		/// Код подразделения
		/// </summary>
		[Column("CEH")]
		public int? DepartmentId { get; set; }
		public Department Department { get; set; }	

		/// <summary>
		/// Наименование технического места
		/// </summary>
		[Column("NRKPPOLN")]
		public string Name { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; }

		/// <summary>
		/// Степень резерва
		/// </summary>
		[Column("KROS")]
		public string StatusId { get; set; }
		public EquipmentStatus Status { get; set; }
		
		[Column("KROV")]
		public string CategoryId { get; set; }
		public EquipmentCategory Category { get; set; }
		
		/// <summary>
		/// Признак Потери производства
		/// </summary>
		[Column("PR_PRODLOS")]
		public bool IsProductionLosses { get; set; }
		
		[Column("KOBJ")]
		public string ItObjectId { get; set; }
		public ItObject ItObject { get; set; }
		
		public List<WorkRequest> WorkRequests { get; set; }
		public List<EquipmentMovementHistory> MovementHistories { get; set; }
		
		public List<ResponsibleSpecialist> ResponsibleSpecialists { get; set; }
	}
}
