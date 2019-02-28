using System;

namespace Web.Tools
{
	partial class Text
	{
		///<summary>
		/// Формат представления даты
		///</summary>
		[Flags]
		public enum DateTimeView
		{
			/// <summary>
			/// Дата и время. Пример: 31.12.2007 14:37
			/// </summary>
			DateTime = 0,
			/// <summary>
			/// Дата. Пример: 31.12.2007
			/// </summary>
			Date = 1,
			/// <summary>
			/// Время. Пример: 14:37
			/// </summary>
			Time = 2,
			/// <summary>
			/// Timestamp (yyyyMMddHHmmss). Пример: 20071231143721
			/// </summary>
			TimeStamp = 4,
			/// <summary>
			/// Отображать 2 знака в году. 
			/// Пример: 31.12.07. Или для даты с временем: 31.12.07 14:37
			/// </summary>
			Year2 = 8,
			/// <summary>
			/// Отображать время с секундами. 
			/// Пример: 14:37:21. Для даты с временем: 31.12.2007 14:37:21
			/// </summary>
			Seconds = 16,
			/// <summary>
			/// YyyyMmDd. Пример: 20071231
			/// </summary>
			YyyyMmDd = TimeStamp | Date
		}
	}
}
