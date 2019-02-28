using System;

namespace Web.Tools
{
	/// <summary>
	/// Инструменты для работы с типами данных
	/// </summary>
	public class TypeTools
	{
		/// <summary>
		/// Получить значение по умолчанию для типа
		/// </summary>
		/// <param name="type">Тип</param>
		/// <returns></returns>
		public static object GetDefaultValue(Type type)
		{
			switch (type.Name)
			{
				case "String":
					return String.Empty;
				case "Int16":
					return (Int16)0;
				case "Int32":
					return 0;
				case "Int64":
					return 0L;
				case "Decimal":
					return 0m;
				case "Double":
					return 0d;
				case "DateTime":
					return DateTime.MinValue;
				default:
					//дополнительная обработка для bool и enum'ов
					return type.IsValueType ?
						Activator.CreateInstance(type) : null;
			}
		}
	}
}