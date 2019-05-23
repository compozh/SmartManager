using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public enum ConditionParameterGroup
	{
		None,
		/// <summary>
		/// Управление качеством
		/// </summary>
		[MapValue(" ", CaptionResourceName = "QualityManagment", IsDefaultValue = true)]
		QualityManagment,
		
		/// <summary>
		/// Интеграция с АСУ ТП
		/// </summary>
		[MapValue("I", CaptionResourceName = "IntegrationAsuTp")]
		IntegrationAsuTp,
		
		/// <summary>
		/// Эксплуатационная статистика
		/// </summary>
		[MapValue("S", CaptionResourceName = "OperatingStatistics")]
		OperatingStatistics,

		/// <summary>
		/// Простои оборудования
		/// </summary>
		[MapValue("D", CaptionResourceName = "DowntimeEquipment")]
		DowntimeEquipment,
		
		/// <summary>
		/// Все
		/// </summary>
		[MapValue("*", CaptionResourceName = "All")]
		All
	}
}