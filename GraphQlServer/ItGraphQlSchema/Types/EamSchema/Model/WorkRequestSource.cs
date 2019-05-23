using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	/// <summary>
	/// Источники заявок на ТОиР
	/// </summary>
	public enum WorkRequestSource
	{
		None,
		/// <summary>
		/// Замечания персонала
		/// </summary>
		[MapValue("1", CaptionResourceName = "RemarksOfStaff", IsDefaultValue = true)]
		RemarksOfStaff,

		/// <summary>
		/// Плановые работы
		/// </summary>
		[MapValue("2", CaptionResourceName = "PlanedWorks")]
		PlanedWorks,

		/// <summary>
		/// Эксплуатационная статистика
		/// </summary>
		[MapValue("3", CaptionResourceName = "OperatingStatistics")]
		OperatingStatistics,

		/// <summary>
		/// Простои оборудования
		/// </summary>
		[MapValue("4", CaptionResourceName = "DowntimeEquipment")]
		DownTime,

		/// <summary>
		/// Аварийный запас ТМЦ
		/// </summary>
		[MapValue("5", CaptionResourceName = "EmergencyStock")]
		EmergencyStock
	}//	
}