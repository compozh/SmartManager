using System;

namespace Web.Data
{
	/// <summary>
	/// Используется для установки соответствия "свойство класса" - "поле БД"
	/// </summary>
	[AttributeUsage(AttributeTargets.Property)]
	public class MapFieldAttribute : Attribute
	{
		/// <summary>
		/// Соответствующее поле БД
		/// </summary>
		public string Field { get; set; }
		/// <summary>
		/// Конструктор
		/// </summary>
		public MapFieldAttribute(string field)
		{
			Field = field;
		}
	}
}