using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.LMS
{
	/// <summary>
	/// LMS. Модуль курсов
	/// </summary>
	[Table("COURSESM")]
	public class ModuleCourses
	{
		[Column("COURSEID")]
		public string CourseId { get; set; }

		[Column("MODULEID")]
		public string ModuleId { get; set; }

		[Column("ORDERNUM")]
		public short OrderNumber { get; set; }

		[Column("STEPID")]
		public decimal StepId { get; set; }

		public Course Course { get; set; }

		public Module Module { get; set; }
	}
}
