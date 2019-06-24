using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.LMS
{
	/// <summary>
	/// LMS. Модуль обучения
	/// </summary>
	[Table("MODULES")]
	public class Module
	{
		[Key, Column("MODULEID")]
		public string Id { get; set; }

		[Column("NAME")]
		public string Name { get; set; }

		[Column("CONTENT")]
		public string Description { get; set; }

		[Column("IMAGECODE")]
		public string ImageCode { get; set; }

		[NotMapped]
		public string ImageLink { get; set; }

		[Column("HEXCOLOR")]
		public string Color { get; set; }

		[Column("ORDERNUM")]
		public short OrderNumber { get; set; }

		[Column("ROLES")]
		public string Roles { get; set; }

		[NotMapped]
		public List<FilterProperty> RolesList { get; set; }

		[Column("LEVELS")]
		public string DifficultyLevels { get; set; }

		[NotMapped]
		public List<FilterProperty> LevelsList { get; set; }

		[Column("TAGS")]
		public string Tags { get; set; }

		[NotMapped]
		public List<FilterProperty> TagsList { get; set; }

		[Column("PROD")]
		public string Product { get; set; }

		[NotMapped]
		public List<FilterProperty> ProductsList { get; set; }

		[NotMapped]
		public int Duration { get; set; }

		[NotMapped]
		public string DurationLabel { get; set; }

		[NotMapped]
		public string LessonsQtLabel { get; set; }

		[NotMapped]
		public string ShowLessonsTitle { get; set; }

		[Column("UNIQGUID")]
		public Guid UniqIdentifier { get; set; }

		[Column("PR_DO")]
		public bool IsValid { get; set; }

		/// <summary>
		/// Изображение
		/// </summary>
		public Image Image { get; set; }

		/// <summary>
		/// Курсы
		/// </summary>
		public List<ModuleCourses> Courses { get; set; }

		/// <summary>
		/// Уроки модуля
		/// </summary>
		public List<Lesson> Lessons { get; set; }
	}
}
