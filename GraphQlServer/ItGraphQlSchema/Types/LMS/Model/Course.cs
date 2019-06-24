using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.LMS.Model;

namespace ItGraphQlSchema.Types.LMS
{
	/// <summary>
	/// LMS. Курс обучения
	/// </summary>
	[Table("COURSES")]
	public class Course
	{
		/// <summary>
		/// Курс
		/// </summary>
		[Key, Column("COURSEID")]
		public string Id { get; set; }

		/// <summary>
		/// Название
		/// </summary>
		[Column("NAME")]
		public string Name { get; set; }

		/// <summary>
		/// Описание курса
		/// </summary>
		[Column("CONTENT")]
		public string Description { get; set; }

		/// <summary>
		/// Изображение
		/// </summary>
		[Column("IMAGECODE")]
		public string ImageCode { get; set; }

		/// <summary>
		/// Ссылка на файл изображения
		/// </summary>
		[NotMapped]
		public string ImageLink { get; set; }

		[Column("HEXCOLOR")]
		public string Color { get; set; }

		/// <summary>
		/// Роли пользователей
		/// </summary>
		[Column("ROLES")]
		public string Roles { get; set; }

		/// <summary>
		/// Список ролей. Вычислимое свойство
		/// </summary>
		[NotMapped]
		public List<FilterProperty> RolesList { get; set; }

		/// <summary>
		/// Уровни сложности
		/// </summary>
		[Column("LEVELS")]
		public string DifficultyLevels { get; set; }

		/// <summary>
		/// Уровни сложности. Вычислимое свойство
		/// </summary>
		[NotMapped]
		public List<FilterProperty> LevelsList { get; set; }

		[Column("TAGS")]
		public string Tags { get; set; }

		/// <summary>
		/// Тэги
		/// </summary>
		[NotMapped]
		public List<FilterProperty> TagsList { get; set; }
		
		/// <summary>
		/// Продукт
		/// </summary>
		[Column("PROD")]
		public string Product { get; set; }

		/// <summary>
		/// Продукты. Вычислимое свойство
		/// </summary>
		[NotMapped]
		public List<FilterProperty> ProductsList { get; set; }

		[Column("UNIQGUID")]
		public Guid CourseGuid { get; set; }

		/// <summary>
		/// Признак "действует/отменен"
		/// </summary>
		[Column("PR_DO")]
		public bool IsValid { get; set; }

		[NotMapped]
		public string Type { get; }

		[NotMapped]
		public bool IsFavorite { get; set; }

		[NotMapped]
		public int ModulesQt { get; set; }

		[NotMapped]
		public string ModulesQtLabel { get; set; }

		[NotMapped]
		public int Duration { get; set; }

		[NotMapped]
		public string DurationLabel { get; set; }

		public List<ModuleCourses> Modules { get; set; }

		public Image Image { get; set; }

		public Course()
		{
			Type = @"Курс";
			IsFavorite = false;
		}
	}
}
