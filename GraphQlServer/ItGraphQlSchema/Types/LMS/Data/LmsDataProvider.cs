using System.Data.SqlClient;
using Web.Data;
using Web.WebRequests;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using ItGraphQlSchema.Types.Common;
using Microsoft.AspNetCore.Http;
using ItGraphQlSchema.Types.LMS.Model;


namespace ItGraphQlSchema.Types.LMS
{
	public interface ILmsDataProvider : ICommonDataProvider
	{
		IQueryable<Course> Courses { get; }
		IQueryable<Module> Modules { get; }
		IQueryable<Lesson> Lessons { get; }
		IQueryable<ModuleCourses> ModuleCourses { get; }
		AvailableFilters GetAvailableFilters();
	}

	[AddInDI(typeof(ILmsDataProvider))]
	internal class LmsDataProvider : CommonDataProvider, ILmsDataProvider
	{
		private readonly WebRequestsTools _webRequest;
		private readonly SqlClient _client;

		private string[] _minuteWord = { "минута", "минуты", "минут" };
		private string[] _lessonWord = { "урок", "урока", "уроков" };
		private string[] _moduleWord = { "модуль", "модуля", "модулей" };

		private AvailableFilters _availableFilters;

		private readonly Dictionary<string, string> _rolesName = new Dictionary<string, string>();
		private readonly Dictionary<string, string> _levelsName = new Dictionary<string, string>();
		private readonly Dictionary<string, string> _productsName = new Dictionary<string, string>();
		private readonly Dictionary<string, string> _tagsName = new Dictionary<string, string>();

		public LmsDataProvider(IHttpContextAccessor httpContextAccessor, WebRequestsTools webRequests, SqlClient sqlClient) : base(httpContextAccessor)
		{
			_webRequest = webRequests;
			_client = sqlClient;

			_availableFilters = GetAvailableFilters();

			foreach (var role in _availableFilters.Roles)
			{
				_rolesName[role.PropertyValue] = role.PropertyName;
			}
			foreach (var level in _availableFilters.Levels)
			{
				_levelsName[level.PropertyValue] = level.PropertyName;
			}
			foreach (var product in _availableFilters.Products)
			{
				_productsName[product.PropertyValue] = product.PropertyName;
			}
			foreach (var tag in _availableFilters.Tags)
			{
				_tagsName[tag.PropertyValue] = tag.PropertyName;
			}
		}

		public IQueryable<Course> Courses
		{
			get
			{
				// Заполнить вычислимые поля
				foreach (var course in DbContext.Courses)
				{
					course.ImageLink = GetImageLink(course.ImageCode);
					course.RolesList = GetPropertyList(course.Roles, "LMSR");
					course.ProductsList = GetPropertyList(course.Product, "PROD");
					course.LevelsList = GetPropertyList(course.DifficultyLevels, "LMSL");
					course.TagsList = GetPropertyList(course.Tags, "LMST");
					course.Duration = GetCourseDuration(course.Id);
					course.DurationLabel = GetNumberTextLabel(course.Duration, _minuteWord);
					course.ModulesQt = GetModulesQty(course.Id);
					course.ModulesQtLabel = GetNumberTextLabel(course.ModulesQt, _moduleWord);
				}
				return DbContext.Courses.Where(c => c.IsValid == true);
			}
		}

		public IQueryable<Module> Modules
		{
			get
			{
				// Заполнить вычислимые поля
				foreach (var module in DbContext.Modules)
				{
					module.ImageLink = GetImageLink(module.ImageCode);
					module.Duration = GetModuleDuration(module.Id);
					module.DurationLabel = GetNumberTextLabel(module.Duration, _minuteWord);
					module.LessonsQtLabel = 
						GetNumberTextLabel(GetLessonQty(module.Id), _lessonWord);
					module.ShowLessonsTitle = string.Format("Показать {0}", module.LessonsQtLabel);
					module.RolesList = GetPropertyList(module.Roles, "LMSR");
					module.LevelsList = GetPropertyList(module.DifficultyLevels, "LMSL");
					module.ProductsList = GetPropertyList(module.Product, "PROD");
					module.TagsList = GetPropertyList(module.Tags, "LMST");
				}
				return DbContext.Modules.Where(c => c.IsValid == true);
			}
		}

		public IQueryable<Lesson> Lessons
		{
			get
			{
				// Заполнить вычислимое поле
				foreach (var lesson in DbContext.Lessons)
				{
					lesson.DurationLabel = GetNumberTextLabel(lesson.Duration, _lessonWord);
				}
				return DbContext.Lessons.Where(l => l.IsValid == true);
			}
		}


		#region Заполнение вычислимых полей

		#region Общие методы
		// Получить текстовую метку в зависимости от величины числа. Например: "1 минута", "3 минуты", "5 минут"
		private string GetNumberTextLabel(int number, string[] word)
		{
			if (number >= 5 && number <= 20)
			{
				return string.Format("{0} {1}", number, word[2]);
			}
			var rest = number % 10;
			if (rest == 1) return string.Format("{0} {1}", number, word[0]);
			if (rest >= 2 && rest <= 4) return string.Format("{0} {1}", number, word[1]);
			if (rest >= 5 && rest <= 9) return string.Format("{0} {1}", number, word[2]);
			return string.Format("{0} {1}", number, word[2]);
		}


		// Получить часть ссылки на файл изображения. Схему и хост добавить на клиенте
		private string GetImageLink(string imageCode)
		{
			var hasImage = DbContext.Images.Where(i => i.Id == imageCode).Any();
			if (hasImage)
			{
				var image = DbContext.Images.Where(i => i.Id == imageCode).Single();
				return string.Format("ws/GetFile.ashx?file={0}&folder=content", string.Concat(image.Id, image.Extension.TrimEnd()));
			}
			return "";
		}


		// Получить значения фильтров критерия
		private List<FilterProperty> GetPropertyList(string propertyString, string source)
		{
			var propertyList = new List<FilterProperty>();

			if (!string.IsNullOrEmpty(propertyString))
			{
				var properties = propertyString.Split(",").ToArray();
				var filetersNames = GetFiltersNames(source);

				foreach (var property in properties)
				{
					string filterName = string.Empty;
					filetersNames.TryGetValue(property, out filterName);

					propertyList.Add(new FilterProperty
					{
						PropertyName = filterName,
						PropertyValue = property
					});
				}
			}
			return propertyList;
		}


		private Dictionary<string,string> GetFiltersNames(string source)
		{
			switch (source)
			{
				case "LMSR":
					return _rolesName;
				case "LMSL":
					return _levelsName;
				case "LMST":
					return _tagsName;
				case "PROD":
					return _productsName;
			}
			return null;
		}

		#endregion

		#region Module
		private int GetModuleDuration(string moduleId)
		{
			var moduleDuration = 0;
			var lessons = DbContext.Lessons.Where(l => l.ModuleId == moduleId && l.IsValid);
			foreach (var lesson in lessons)
			{
				moduleDuration += lesson.Duration;
			}
			return moduleDuration;
		}


		private int GetLessonQty(string moduleId)
		{
			var lessons = DbContext.Lessons.Where(l => l.ModuleId == moduleId && l.IsValid);
			return lessons.Count();
		}

		#endregion

		#region Course
		private int GetModulesQty(string courseId)
		{
			var number = GetModulesOfCourse(courseId).Count();
			return number;
		}


		private int GetCourseDuration(string courseId)
		{
			var duration = 0;
			var modulesOfCourse = GetModulesOfCourse(courseId);
			foreach (var module in modulesOfCourse)
			{
				duration += GetModuleDuration(module.Id);
			}
			return duration;
		}

		private IQueryable<Module> GetModulesOfCourse(string courseId)
		{
			var allModulesCourses = DbContext.ModuleCourses;
			var modules = DbContext.Modules;

			return from moduleCourse in allModulesCourses
					join module in modules on moduleCourse.ModuleId equals module.Id
					where moduleCourse.CourseId == courseId && module.IsValid
					select module;
		}

		#endregion

		#endregion

		public IQueryable<ModuleCourses> ModuleCourses => DbContext.ModuleCourses;


		/// <summary>
		/// Получить допустимые фильтры
		/// </summary>
		/// <returns></returns>
		public AvailableFilters GetAvailableFilters()
		{
			AvailableFilters filters = null;

			var command = _client.CreateCommand(
				@"SELECT SPR, NAIM, KOD_C 
				FROM SP2
				WHERE SPR IN ('PROD', 'LMSR', 'LMST', 'LMSL') AND KOD_N = 0");

			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (reader.HasRows)
				{
					filters = new AvailableFilters();
					filters.Roles = new List<FilterProperty>();
					filters.Levels = new List<FilterProperty>();
					filters.Products = new List<FilterProperty>();
					filters.Tags = new List<FilterProperty>();
					while (reader.Read())
					{
						var filterName = reader.GetString(0).Trim();
						var filterProperties = new FilterProperty
						{
							PropertyName = reader.GetString(1).Trim(),
							PropertyValue = reader.GetString(2).Trim()
						};
						switch (filterName)
						{
							case "LMSR":
								filters.Roles.Add(filterProperties);
								break;
							case "LMSL":
								filters.Levels.Add(filterProperties);
								break;
							case "LMST":
								filters.Tags.Add(filterProperties);
								break;
							case "PROD":
								filters.Products.Add(filterProperties);
								break;
						}
					}
				}
			}
			return filters;
		}
	}
}
