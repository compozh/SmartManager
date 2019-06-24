using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.LMS
{
	/// <summary>
	/// LMS. Урок
	/// </summary>
	public class Lesson
	{
		[Column("LESSONID")]
		public string LessonId { get; set; }

		[Column("MODULEID")]
		public string ModuleId { get; set; }

		[Column("NAME")]
		public string Name { get; set; }

		/// <summary>
		/// Содержание урока
		/// </summary>
		[Column("CONTENT")]
		public string Content { get; set; }

		[Column("DURATION")]
		public int Duration { get; set; }

		[NotMapped]
		public string DurationLabel { get; set; }

		[Column("ORDERNUM")]
		public short OrderNumber { get; set; }

		[Column("KODSYS")]
		public string SystemModule { get; set; }

		[Column("UNIQGUID")]
		public Guid UniqIdentifier { get; set; }

		/// <summary>
		/// Краткое описание урока
		/// </summary>
		[Column("DESCRIPTIO")]
		public string Description { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; }

		public Module Module { get; set; }
	}
}
