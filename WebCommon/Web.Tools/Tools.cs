using System;
using System.Diagnostics;

namespace Web.Tools
{
	public static class WebTools
	{
		public static DateTime UtcToLocal(DateTime utcTime)
		{
			if (utcTime != DateTime.MinValue && utcTime.Kind == DateTimeKind.Utc)
			{
				return utcTime.ToLocalTime();
			}
			return DateTime.MinValue;
		}

		/// <summary>
		/// Превращает указанное значение в нужный тип
		/// </summary>
		/// <typeparam name="T">Тип в который преобразовать</typeparam>
		/// <param name="result">Результат для преобразования</param>
		/// <returns>Результат в указанном типе</returns>
		public static T ConvertResult<T>(object result)
		{
			// Обработать результат
			if (result == null || result is DBNull)
			{
				// Получили null
				if (typeof (T) == typeof (string))
				{
					return (T) (object) string.Empty;
				}
				return default(T);
			}
			// Для типов Nullable<T> эта проверка тоже сработает корректно: int? is int == true
			if (result is T)
			{
				// Если указали правильный тип результата - просто привести тип
				return (T) result;
			}
			// Получаем тип возвращаеммого значения
			var returnType = typeof (T);

			// Если мы выполняем конвертацию между типами int => decimal?, byte => int? и т.д.
			if (returnType.IsGenericType && returnType.GetGenericTypeDefinition() == typeof (Nullable<>))
			{
				var nullableType = Nullable.GetUnderlyingType(returnType);
				// Поскольку типы разные - то выполняем сначало конвертацию
				var nullableConvertedValue = Convert.ChangeType(result, nullableType);

				// Создаем экземпляр класса
				return (T) Activator.CreateInstance(returnType, new[] {nullableConvertedValue});
			}

			return convert<T>(result);
		}


		/// <summary>
		/// Выполнить конвертацию. Вынесено в отдельный метод для пометки атрибутом <see cref="DebuggerStepThroughAttribute"/>
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="result"></param>
		/// <returns></returns>
		[DebuggerStepThrough]
		private static T convert<T>(object result)
		{
			// Иначе пытается конвертировать результат к указанному типу. 
			// Если не получится - сгенерировать исключение
			T returnResult;
			try
			{
				returnResult = (T) Convert.ChangeType(result, typeof (T));
			}
			catch (InvalidCastException)
			{
				dynamic dynamicType = result;
				// Если не удалось конвертировать с помошью ChangeType - пробуем сделать конвертацию вручную с помощью dynamic
				// Используется на тот случай, если у типа "T" есть implicit или explicit операторы
				// Делаем через dynamic, т.к. explicit и implicit операторы в Generic методах не работают, а dynamic внутри себя 
				// через reflection вызовет нужные операторы конвертации
				// Используется при конвертации string -> SqlCmdText
				returnResult = (T) dynamicType;
			}
			return returnResult;
		}

	}
}