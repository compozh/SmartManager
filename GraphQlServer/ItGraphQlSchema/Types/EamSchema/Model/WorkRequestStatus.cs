using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	/// <summary>
	/// Статус заявки на ТОиР
	/// </summary>
	public enum WorkRequestStatus
	{
		None,
		/// <summary>
		/// Создание
		/// </summary>
		[MapValue("C", CaptionResourceName = "Creation", IsDefaultValue = true)]
		Creation,

		/// <summary>
		/// Диспетчер
		/// </summary>
		[MapValue("D", CaptionResourceName = "Dispatcher")]
		Dispatcher,

		/// <summary>
		/// Ответственный
		/// </summary>
		[MapValue("R", CaptionResourceName = "Responsible")]
		Responsible,

		/// <summary>
		/// Подготовка
		/// </summary>
		[MapValue("P", CaptionResourceName = "Preparation")]
		Preparation,

		/// <summary>
		/// Исполнение
		/// </summary>
		[MapValue("E", CaptionResourceName = "Execution")]
		Execution,

		/// <summary>
		/// Выполнена
		/// </summary>
		[MapValue("F", CaptionResourceName = "Done")]
		Done,

		/// <summary>
		/// Отменена
		/// </summary>
		[MapValue("O", CaptionResourceName = "Canceled")]
		Canceled,

		/// <summary>
		/// Архив
		/// </summary>
		[MapValue("A", CaptionResourceName = "Archive")]
		Archive
	}
}