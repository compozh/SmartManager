using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ItGraphQlSchema.Types.EamSchema
{
	public enum ConditionParameterGroup
	{
		/// <summary>
		/// Управление качеством
		/// </summary>
		//[MapValue(" ", CaptionResourceName = "QualityManagment", IsDefaultValue = true)]
		QualityManagment,
		
		/// <summary>
		/// Интеграция с АСУ ТП
		/// </summary>
		//[MapValue("I", CaptionResourceName = "IntegrationAsuTp")]
		IntegrationAsuTp,
		
		/// <summary>
		/// Эксплуатационная статистика
		/// </summary>
		//[MapValue("S", CaptionResourceName = "OperatingStatistics")]
		OperatingStatistics,

		/// <summary>
		/// Простои оборудования
		/// </summary>
		//[MapValue("D", CaptionResourceName = "DowntimeEquipment")]
		DowntimeEquipment,
		
		/// <summary>
		/// Все
		/// </summary>
		//[MapValue("*", CaptionResourceName = "All")]
		All,
		None,
		Unknown
	}

	public class ConditionParameterGroupConverter : ValueConverter<ConditionParameterGroup, string>
	{
		public ConditionParameterGroupConverter() : base(v =>
				v == ConditionParameterGroup.QualityManagment
					? ""
					: v == ConditionParameterGroup.IntegrationAsuTp
						? "I"
						: v == ConditionParameterGroup.OperatingStatistics
							? "S"
							: v == ConditionParameterGroup.DowntimeEquipment
								? "D"
								: v == ConditionParameterGroup.All
									? "*"
									: string.Empty,
			v => string.IsNullOrEmpty(v)
				? ConditionParameterGroup.QualityManagment
				: v == "I"
					? ConditionParameterGroup.IntegrationAsuTp
					: v == "S"
						? ConditionParameterGroup.OperatingStatistics
						: v == "D"
							? ConditionParameterGroup.DowntimeEquipment
							: v == "*"
								? ConditionParameterGroup.All
								: ConditionParameterGroup.Unknown)
		{
		}
	}
}