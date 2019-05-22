using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("ROK")]
	public class Equipment
	{
		/// <summary>
		/// Код объекта ремонта
		/// </summary>
		[Key, Column("KROK")]
		public string Id { get; set; }

		/// <summary>
		/// Наименование объекта ремонта
		/// </summary>
		[Column("NROK")]
		public string Name { get; set; }

		[Column("NROK_S")]
		public string Designation { get; set; }

		[Column("NROKPOLN")]
		public string FullName { get; set; }

		/// <summary>
		/// Описание объекта ремонта
		/// </summary>
		[Column("COMM")]
		public string Description { get; set; }

		/// <summary>
		/// Код типа оборудования
		/// </summary>
		[Column("KROT")]
		public string TypeId { get; set; }

		public EquipmentType Type { get; set; }

		/// <summary>
		/// Код модели оборудования
		/// </summary>
		[Column("KMAT_ROK")]
		public string ModelId { get; set; }

		public Resource Model { get; set; }

		/// <summary>
		/// Заводской номер
		/// </summary>
		[Column("NZAV")]
		public string FactoryNumber { get; set; }

		/// <summary>
		/// Код подразделения
		/// </summary>
		[Column("CEH")]
		public int? DepartmentId { get; set; }

		public Department Department { get; set; }

		[Column("KROV")]
		public string CategoryId { get; set; }

		public EquipmentCategory Category { get; set; }

		[Column("KOBJ")]
		public string ItObjectId { get; set; }

		public ItObject ItObject { get; set; }

		/// <summary>
		/// Дата выпуска
		/// </summary>
		[Column("D_IZG")]
		public DateTime? ManufacturingDate { get; set; }

		/// <summary>
		/// Дата ввода в экспл.
		/// </summary>
		[Column("DVEK")]
		public DateTime? InstallDate { get; set; }

		/// <summary>
		/// Табельный номер ответственного
		/// </summary>
		[Column("N_KDK")]
		public string ResponsibleEmployeeId { get; set; }

		public Employee ResponsibleEmployee { get; set; }

		/// <summary>
		/// Степень резерва
		/// </summary>
		[Column("KROS")]
		public string StatusId { get; set; }

		public EquipmentStatus Status { get; set; }

		/// <summary>
		/// Признак действует/отменено
		/// </summary>
		[NotMapped]
		public bool IsValid => DateTo == null || DateTo >= DateTime.Now;

		/// <summary>
		/// Дата конца периода действия
		/// </summary>
		[Column("ROKDTO")]
		public DateTime? DateTo { get; set; }

		/// <summary>
		/// Паспортный коэффициент использования
		/// </summary>
		[Column("KOEF")]
		public decimal UtilizationRate { get; set; }

		public List<WorkRequest> WorkRequests { get; set; }
		public List<EquipmentMovementHistory> MovementHistories { get; set; }
	}
}
