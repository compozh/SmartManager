using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ItGraphQlSchema.Types.EamSchema
{
	/// <summary>
	/// Источники заявок на ТОиР
	/// </summary>
	public enum WorkRequestSource
	{
		/// <summary>
		/// Замечания персонала
		/// </summary>
		//[MapValue("1", CaptionResourceName = "RemarksOfStaff", IsDefaultValue = true)]
		RemarksOfStaff,

		/// <summary>
		/// Плановые работы
		/// </summary>
		//[MapValue("2", CaptionResourceName = "PlanedWorks")]
		PlanedWorks,

		/// <summary>
		/// Эксплуатационная статистика
		/// </summary>
		//[MapValue("3", CaptionResourceName = "OperatingStatistics")]
		OperatingStatistics,

		/// <summary>
		/// Простои оборудования
		/// </summary>
		//[MapValue("4", CaptionResourceName = "DowntimeEquipment")]
		DownTime,

		/// <summary>
		/// Аварийный запас ТМЦ
		/// </summary>
		//[MapValue("5", CaptionResourceName = "EmergencyStock")]
		EmergencyStock,
		None,
		Unknown
	}

	public class WorkRequestSourceConverter : ValueConverter<WorkRequestSource, string>
	{
		public WorkRequestSourceConverter() : base(v =>
				v == WorkRequestSource.RemarksOfStaff
					? "1"
					: v == WorkRequestSource.PlanedWorks
						? "2"
						: v == WorkRequestSource.OperatingStatistics
							? "3"
							: v == WorkRequestSource.DownTime
								? "4"
								: v == WorkRequestSource.EmergencyStock
									? "5"
									: string.Empty,
			v => string.IsNullOrEmpty(v)
				? WorkRequestSource.None
				: v.TrimEnd() == "1"
					? WorkRequestSource.RemarksOfStaff
					: v.TrimEnd() == "2"
						? WorkRequestSource.PlanedWorks
						: v.TrimEnd() == "3"
							? WorkRequestSource.OperatingStatistics
							: v.TrimEnd() == "4"
								? WorkRequestSource.DownTime
								: v.TrimEnd() == "5"
									? WorkRequestSource.EmergencyStock
									: WorkRequestSource.Unknown)
		{
		}
	}
}