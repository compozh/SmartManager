using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ItGraphQlSchema.Types.EamSchema
{
	/// <summary>
	/// Статус заявки на ТОиР
	/// </summary>
	public enum WorkRequestStatus
	{
		/// <summary>
		/// Создание
		/// </summary>
		//[MapValue("C", CaptionResourceName = "Creation", IsDefaultValue = true)]
		Creation,

		/// <summary>
		/// Диспетчер
		/// </summary>
		//[MapValue("D", CaptionResourceName = "Dispatcher")]
		Dispatcher,

		/// <summary>
		/// Ответственный
		/// </summary>
		//[MapValue("R", CaptionResourceName = "Responsible")]
		Responsible,

		/// <summary>
		/// Подготовка
		/// </summary>
		//[MapValue("P", CaptionResourceName = "Preparation")]
		Preparation,

		/// <summary>
		/// Исполнение
		/// </summary>
		//[MapValue("E", CaptionResourceName = "Execution")]
		Execution,

		/// <summary>
		/// Выполнена
		/// </summary>
		//[MapValue("F", CaptionResourceName = "Done")]
		Done,

		/// <summary>
		/// Отменена
		/// </summary>
		//[MapValue("O", CaptionResourceName = "Canceled")]
		Canceled,

		/// <summary>
		/// Архив
		/// </summary>
		//[MapValue("A", CaptionResourceName = "Archive")]
		Archive,
		None,
		Unknown
	}

	public class WorkRequestStatusConverter : ValueConverter<WorkRequestStatus, string>
	{
		public WorkRequestStatusConverter() : base(v =>
				v == WorkRequestStatus.Creation
					? "C"
					: v == WorkRequestStatus.Dispatcher
						? "D"
						: v == WorkRequestStatus.Responsible
							? "R"
							: v == WorkRequestStatus.Preparation
								? "P"
								: v == WorkRequestStatus.Execution
									? "E"
									: v == WorkRequestStatus.Done
										? "F"
										: v == WorkRequestStatus.Canceled
											? "O"
											: v == WorkRequestStatus.Archive
												? "A"
												: string.Empty,
			v => string.IsNullOrEmpty(v)
				? WorkRequestStatus.None
				: v == "C"
					? WorkRequestStatus.Creation
					: v == "D"
						? WorkRequestStatus.Dispatcher
						: v == "R"
							? WorkRequestStatus.Responsible
							: v == "P"
								? WorkRequestStatus.Preparation
								: v == "E"
									? WorkRequestStatus.Execution
									: v == "F"
										? WorkRequestStatus.Done
										: v == "O"
											? WorkRequestStatus.Canceled
											: v == "A"
												? WorkRequestStatus.Archive
												: WorkRequestStatus.Unknown)
		{
		}
	}
}