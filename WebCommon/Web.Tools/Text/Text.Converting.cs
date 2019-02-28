using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics.Contracts;
using System.Globalization;
using System.Text;
using Web.Tools.Properties;

namespace Web.Tools
{
	partial class Text
	{
		/// <summary>
		/// Конвертировать строку в DateTime
		/// </summary>
		/// <param name="s">Строка для конвертации в дату</param>
		/// <param name="view">Тип представления даты в строке</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static DateTime ToDateTime(string s, DateTimeView view)
		{
			if (String.IsNullOrEmpty(s))
			{
				return DateTime.MinValue;
			}
			DateTime dateTimeResult;
			if ((view & DateTimeView.TimeStamp) == DateTimeView.TimeStamp)
			{
				// если передали дату в формате ГГГГММДД без времени, то установить время 00:00:00
				if (s.Length == 8)
				{
					s = s.PadRight(14, '0');
				}
				DateTime.TryParseExact(s, GetDateTimeFormat(DateTimeView.TimeStamp), DateTimeFormat, DateTimeStyles.None,
					out dateTimeResult);
				return dateTimeResult;
			}
			DateTime.TryParse(s, DateTimeFormat, DateTimeStyles.None, out dateTimeResult);
			return dateTimeResult;
		}

		/// <summary>
		/// Конвертировать строку в DateTime
		/// </summary>
		/// <param name="s">Строка для конвертации в дату</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static DateTime ToDateTime(string s)
		{
			return ToDateTime(s, DateTimeView.DateTime | DateTimeView.Seconds);
		}

		/// <summary>
		/// Конвертировать объект в строку
		/// </summary>
		/// <param name="value">Значение</param>
		/// <returns>Строковое значение</returns>
		[Pure]
		public static string Convert(object value)
		{
			if (value == null)
			{
				return string.Empty;
			}
			TypeCode type = Type.GetTypeCode(value.GetType());
			switch (type)
			{
				case TypeCode.DBNull:
					return "null";
				case TypeCode.Int16:
					return ((Int16)value).ToString(PointDecimalSeparator);
				case TypeCode.UInt16:
					return ((UInt16)value).ToString(PointDecimalSeparator);
				case TypeCode.Int32:
					return Convert((Int32)value);
				case TypeCode.UInt32:
					return ((UInt32)value).ToString(PointDecimalSeparator);
				case TypeCode.Int64:
					return ((Int64)value).ToString(PointDecimalSeparator);
				case TypeCode.UInt64:
					return ((UInt64)value).ToString(PointDecimalSeparator);
				case TypeCode.Single:
					return ((Single)value).ToString(PointDecimalSeparator);
				case TypeCode.Double:
					return Convert((Double)value);
				case TypeCode.Decimal:
					return Convert((Decimal)value);
				case TypeCode.DateTime:
					return Convert((DateTime)value);
				case TypeCode.Char :
					return Convert((char)value);
				default:
					return value.ToString();
			}
		}

		/// <summary>
		/// Конвертировать строку в другой тип
		/// </summary>
		/// <param name="s">Исходная строка</param>
		/// <param name="targetType">Тип, в который конвертировать</param>
		/// <returns></returns>
		/// <exclude />
		[EditorBrowsable(EditorBrowsableState.Never)]
		[Browsable(false)]
		[Pure]
		public static object ToTypedObject(string s, Type targetType)
		{
			if (s == null)
			{
				s = string.Empty;
			}
			TypeCode type = Type.GetTypeCode(targetType);
			switch (type)
			{
				case TypeCode.DBNull:
					return DBNull.Value;
				case TypeCode.Int16:
					return System.Convert.ToInt16(s, PointDecimalSeparator);
				case TypeCode.UInt16:
					return System.Convert.ToUInt16(s, PointDecimalSeparator);
				case TypeCode.Int32:
					return ToInt32(s);
				case TypeCode.UInt32:
					return System.Convert.ToUInt32(s, PointDecimalSeparator);
				case TypeCode.Int64:
					return System.Convert.ToInt64(s, PointDecimalSeparator);
				case TypeCode.UInt64:
					return System.Convert.ToUInt64(s, PointDecimalSeparator);
				case TypeCode.Single:
					return System.Convert.ToSingle(s, PointDecimalSeparator);
				case TypeCode.Double:
					return (Double)ToDecimal(s);
				case TypeCode.Decimal:
					return ToDecimal(s);
				case TypeCode.DateTime:
					return ToDateTime(s);
				case TypeCode.Char:
					return s.Length>0 ? s[0] : new Char();
				case TypeCode.String:
					return s;
				default:
					return null;
			}
		}

		/// <summary>
		/// Конвертировать дату и время в строку
		/// </summary>
		/// <param name="value">Дата</param>
		/// <returns>Строковое описание даты</returns>
		[Pure]
		public static string Convert(DateTime value)
		{
			return Convert(value, DateTimeView.DateTime | DateTimeView.Seconds);
		}

		/// <summary>
		/// Конвертировать decimal в строку заданной длины и точности
		/// </summary>
		/// <param name="value">Числовое значение типа decimal</param>
		/// <param name="len">Общая длина строки</param>
		/// <param name="dec"></param>
		/// <returns>Строковое представление</returns>
		[Pure]
		public static string Convert(decimal value, int len, int dec=0)
		{
			if (len <= 0 || len <= dec)
			{
				return Convert(value);
			}

			string result;
			if (dec <= 0)
			{
				// Конвертировать только целую часть
				result = Convert((long)Math.Floor(value));
			}
			else
			{
				string mask = "0."+new string('0', dec);
				result = value.ToString(mask, PointDecimalSeparator);
			}
			if (result.Length > len)
			{
				// Не влезло. Возвращаем звездочки
				return new string('*', len);
			}
			return PadLeft(result, len);
		}

		/// <summary>
		/// Дробная часть маски для преобразования decimal в строку без вывода завершающих нулей
		/// Количество знаков после разделителя выбрано исходя из максимальной точности decimal (28 знаков)
		/// </summary>
		readonly static string _decimalTypeDecimalPlacesMask = new string('#', 28);

		/// <summary>
		/// Конвертировать decimal в строку
		/// </summary>
		/// <param name="value">Числовое значение типа decimal</param>
		/// <returns>Строковое представление</returns>
		[Pure]
		public static string Convert(decimal value)
		{

			return value.ToString("0." + _decimalTypeDecimalPlacesMask, PointDecimalSeparator);
		}

		/// <summary>
		/// <para>Конвертировать double в строку</para>
		/// <para>Если значение double - бесконечность 
		/// (<see cref="double.PositiveInfinity"/>, <see cref="double.NegativeInfinity"/>,
		/// <see cref="double.NaN"/>) - будет возвращен 0</para>
		/// </summary>
		/// <param name="value">Числовое значение типа double</param>
		/// <returns>Строковое представление</returns>
		[Pure]
		public static string Convert(double value)
		{
			if (double.IsInfinity(value) || double.IsNaN(value))
			{
				return (0d).ToString(PointDecimalSeparator);
			}
			// TODO: переписать конвертацию, сейчас реализован самый простой вариант
			// Используем стандартную конвертацию
			string result = value.ToString("R", PointDecimalSeparator);
			// Если конвертация была сделана в научный формат - то нужно заново преобразовать
			if (result.Contains("E"))
			{
				// Данная ситуация помогает только если большая дробная часть.
				// Сделано как вариант решения срочной проблемы
				result = value.ToString("F50", PointDecimalSeparator).TrimEnd('0');
				// Если всё-же дробной части не было - выкидываем её
				if (result[result.Length - 1] == '.')
				{
					result = result.Substring(0, result.Length - 2);
				}
			}
			return result;
		}

		/// <summary>
		/// Конвертировать int в строку
		/// </summary>
		/// <param name="value">Число</param>
		/// <returns>Строковое представление числа</returns>
		[Pure]
		public static string Convert(int value)
		{
			return value.ToString(PointDecimalSeparator);
		}

		/// <summary>
		/// Конвертировать long в строку
		/// </summary>
		/// <param name="value">Число</param>
		/// <returns>Строковое представление числа</returns>
		[Pure]
		public static string Convert(long value)
		{
			return value.ToString(PointDecimalSeparator);
		}


		/// <summary>
		/// Конвертировать char в строку
		/// </summary>
		/// <param name="value">Символ</param>
		/// <returns>Строковое представление числа</returns>
		[Pure]
		public static string Convert(char value)
		{
			return value.ToString(CultureInfo.InvariantCulture);
		}

		/// <summary>
		/// Конвертировать дату и время в строку, используя указанный формат представления даты
		/// </summary>
		/// <param name="value">Дата для конвертации</param>
		/// <param name="view">Формат представления даты</param>
		/// <returns>Строковое описание даты</returns>
		[Pure]
		public static string Convert(DateTime value, DateTimeView view)
		{
			if (value == DateTime.MinValue)
			{
				return string.Empty;
			}
			return value.ToString(GetDateTimeFormat(view), DateTimeFormat);
		}

		/// <summary>
		/// Получить строку пустой даты, используя указанный формат.
		/// Пример: "  .  .       :  :  "
		/// </summary>
		/// <param name="view">Формат представления даты</param>
		/// <returns>Строка пустой даты</returns>
		[Pure]
		public static string GetEmptyDate(DateTimeView view)
		{
			string format = GetDateTimeFormat(view);
			var charFormat = format.ToCharArray();
			var emptyDate = new StringBuilder();
			for (int i = 0; i < charFormat.Length; i++)
			{
				if (charFormat[i].ToString(CultureInfo.InvariantCulture).Equals(DateTimeFormat.TimeSeparator) || 
					charFormat[i].ToString(CultureInfo.InvariantCulture).Equals(DateTimeFormat.DateSeparator))
				{
					emptyDate.Append(charFormat[i]);
				}
				else
				{
					emptyDate.Append(' ');
				}
			}
			return emptyDate.ToString();
		}

		/// <summary>
		/// Конвертировать интервал времени в строку
		/// </summary>
		/// <param name="firstDate">Первая дата</param>
		/// <param name="secondDate">Вторая дата</param>
		/// <param name="view">Тип представления интервала в строке</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static string Convert(DateTime firstDate, DateTime secondDate, TimeSpanView view = TimeSpanView.Long)
		{
			return Convert(secondDate - firstDate, view);
		}

		/// <summary>
		/// Конвертировать интервал времени в строку
		/// Пример длинного формата: "10 дней 4 часа 3 минуты"
		/// Пример короткого формата: "10д 4ч 3м"
		/// </summary>
		/// <param name="timeSpan">Интервал времени</param>
		/// <param name="view">Тип представления интервала в строке</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static string Convert(TimeSpan timeSpan, TimeSpanView view = TimeSpanView.Long)
		{
			var timeBuilder = new StringBuilder();
			var days = Math.Abs(timeSpan.Days);
			if (days > 0)
			{
				timeBuilder.AppendFormat("{0}{1}",
					days, 
					view == TimeSpanView.Short 
						? Resource.DayShort
						: string.Concat(" ", getNumberLabel(days, Resource.DayNominative, Resource.DaysGenitiveOne, Resource.DaysGenitive)));
			}
			var hours = Math.Abs(timeSpan.Hours);
			if (hours > 0)
			{
				if (timeBuilder.Length > 0)
				{
					timeBuilder.Append(" ");
				}
				timeBuilder.AppendFormat("{0}{1}",
					hours, 
					view == TimeSpanView.Short 
						? Resource.HourShort
						: string.Concat(" ", getNumberLabel(hours, Resource.HourNominative, Resource.HoursGenitiveOne, Resource.HoursGenitive)));
			}
			var minutes = Math.Abs(timeSpan.Minutes);
			if (minutes > 0)
			{
				if (timeBuilder.Length > 0)
				{
					timeBuilder.Append(" ");
				}
				timeBuilder.AppendFormat("{0}{1}",
					minutes,
					view == TimeSpanView.Short
						? Resource.MinuteShort
						: string.Concat(" ", getNumberLabel(minutes, Resource.MinuteNominative, Resource.MinutesGenitiveOne, Resource.MinutesGenitive)));
			}
			return timeBuilder.ToString();
		}

		/// <summary>
		/// Получить строку даты для интервала
		/// </summary>
		/// <param name="firstDate"></param>
		/// <param name="secondDate"></param>
		/// <param name="view">Тип метки. Примеры для коротких меток: г,м. Примеры долгих: год, месяц.</param>
		/// <param name="dateRank">Если меньше 1 - метод возвращает все разряды даты. В другом случае - заданное количество разрядов, начиная с большего.
		/// Например, при dateRank==2 будут выводится годы-месяцы, месяцы-дни, дни-минуты</param>
		/// <returns>Строку даты для интервала. Без отрицательного знака. Максимальный разряд - года, минимальный - секунды</returns>
		[Pure]
		public static string GetDurationName(DateTime firstDate, DateTime secondDate, TimeSpanView view = TimeSpanView.Long, int dateRank = -1)
		{
			if (firstDate == secondDate)
			{
				return string.Empty;
			}
			var laterDate = secondDate > firstDate ? secondDate : firstDate;
			var earlierDate = secondDate > firstDate ? firstDate : secondDate;
			var datePathNames = new[,] {
				{ Resource.YearShort, Resource.YearNominative, Resource.YearsGenitiveOne, Resource.YearsGenitive },
				{ Resource.MonthShort, Resource.MonthNominative, Resource.MonthsGenitiveOne, Resource.MonthsGenitive },
				{ Resource.DayShort, Resource.DayNominative, Resource.DaysGenitiveOne, Resource.DaysGenitive },
				{ Resource.HourShort, Resource.HourNominative, Resource.HoursGenitiveOne, Resource.HoursGenitive },
				{ Resource.MinuteShort2, Resource.MinuteNominative, Resource.MinutesGenitiveOne, Resource.MinutesGenitive },
				{ Resource.SecondShort, Resource.SecondNominative, Resource.SecondsGenitiveOne, Resource.SecondsGenitive },
			};
			var timeSpan = laterDate - earlierDate;
			var years = 0;
			var months = 0;
			var days = timeSpan.Days;
			// Для корректной обработки количества лет, месяцев и дней нету стандартных возможностей, поэтому частично используем решение из StackOverflow 
			// https://stackoverflow.com/questions/4638993/difference-in-months-between-two-dates
			if (timeSpan.Days > 28)
			{
				var timeSpanExt = DateTimeSpan.CompareDates(secondDate, firstDate);
				years = timeSpanExt.Years;
				months = timeSpanExt.Months;
				days = timeSpanExt.Days;
			}
			var datePaths = new List<int> {
				years,
				months,
				days,
				timeSpan.Hours,
				timeSpan.Minutes,
				timeSpan.Seconds
			};
			
			var timeBuilder = new StringBuilder();
			var y = 0;
			for (var i = 0; i < datePaths.Count; i++)
			{
				if (datePaths[i] == 0 && y == 0)
				{
					continue;
				}
				y++;
				if (dateRank > 0 && y > dateRank)
				{
					break;
				}
				if (datePaths[i] == 0)
				{
					continue;
				}
				timeBuilder.AppendFormat("{0}{1} ",
					datePaths[i],
					view == TimeSpanView.Short ? 
						datePathNames[i, 0] : 
						string.Concat(" ", getNumberLabel(datePaths[i], datePathNames[i, 1], datePathNames[i, 2], datePathNames[i, 3])));
			}
			if (timeBuilder.Length > 0)
			{
				timeBuilder.Length--;
			}
			return timeBuilder.ToString();
		}
		
		/// <summary>
		/// Вспомогательный класс для вычисления лет, месяцев и дней между датами 
		/// </summary>
		private struct DateTimeSpan
		{
			public int Years { get; private set; }

			public int Months { get; private set; }

			public int Days { get; private set; }

			private enum Phase
			{
				Years,
				Months,
				Days,
				Done
			}

			public static DateTimeSpan CompareDates(DateTime date1, DateTime date2)
			{
				if (date2 < date1)
				{
					var sub = date1;
					date1 = date2;
					date2 = sub;
				}

				var current = date1;
				var years = 0;
				var months = 0;
				var days = 0;

				var phase = Phase.Years;
				var span = new DateTimeSpan();
				var officialDay = current.Day;

				while (phase != Phase.Done)
				{
					switch (phase)
					{
						case Phase.Years:
							if (current.AddYears(years + 1) > date2)
							{
								phase = Phase.Months;
								current = current.AddYears(years);
							}
							else
							{
								years++;
							}

							break;
						case Phase.Months:
							if (current.AddMonths(months + 1) > date2)
							{
								phase = Phase.Days;
								current = current.AddMonths(months);
								if (current.Day < officialDay && officialDay <= DateTime.DaysInMonth(current.Year, current.Month))
									current = current.AddDays(officialDay - current.Day);
							}
							else
							{
								months++;
							}

							break;
						case Phase.Days:
							if (current.AddDays(days + 1) > date2)
							{
								current = current.AddDays(days);
								span = new DateTimeSpan { Days = days, Months = months, Years = years };
								phase = Phase.Done;
							}
							else
							{
								days++;
							}

							break;
					}
				}

				return span;
			}
		}

		/// <summary>
		/// Выбрать склонение в зависимости от числа
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="one">Для числа 1</param>
		/// <param name="lessFive">Для чисел 2,3,4</param>
		/// <param name="moreThanFive">Для чисел 5 и выше</param>
		/// <returns></returns>
		private static string getNumberLabel(int number, string one, string lessFive, string moreThanFive)
		{
			var numberLabel = "";
			if (number == 1)
			{
				numberLabel = one;
			}
			else if (number > 1 && number < 5)
			{
				numberLabel = lessFive;
			}
			else if (number >= 5)
			{
				numberLabel = moreThanFive;
			}
			return numberLabel;
		}

		/// <summary>
		/// Формат интервала
		/// </summary>
		public enum TimeSpanView
		{
			/// <summary>
			/// Длинный
			/// </summary>
			Long = 0,

			/// <summary>
			/// Краткий
			/// </summary>
			Short = 1
		}

		/// <summary>
		/// Получить строку формата по указанным флагам представления даты
		/// </summary>
		/// <param name="view">Формат представления даты</param>
		/// <returns>Строка формата</returns>
		[Pure]
		public static string GetDateTimeFormat(DateTimeView view)
		{
			string format;

			if ( (view & DateTimeView.TimeStamp) == DateTimeView.TimeStamp)
			{		
				if ((view & DateTimeView.Date) == DateTimeView.Date)
				{
					//Если выбран режим TimeStamp + Date
					format = _timeStampFormat.Substring(0,8);
				}
				else if ((view & DateTimeView.Time) == DateTimeView.Time && (view & DateTimeView.Seconds) == DateTimeView.Seconds)
				{
					format = String.Format("{0} {1}", _timeStampFormat.Substring(0, 8), DateTimeFormat.LongTimePattern);
				}	
				else
				{
					//Если выбран режим TimeStamp
					format = _timeStampFormat;
				}
			}
			else if ((view & DateTimeView.Date) == DateTimeView.Date)
				{
					// Дата
					format = (view & DateTimeView.Year2) == DateTimeView.Year2
						? DateTimeFormat.ShortDatePattern
						: DateTimeFormat.LongDatePattern;
				}
				else if ((view & DateTimeView.Time) == DateTimeView.Time)
				{
					// Время
					format = (view & DateTimeView.Seconds) == DateTimeView.Seconds
						? DateTimeFormat.LongTimePattern
						: DateTimeFormat.ShortTimePattern;
				}
				else
				{
					// Дата и время
					format = String.Format("{0} {1}",
						(view & DateTimeView.Year2) == DateTimeView.Year2
							? DateTimeFormat.ShortDatePattern
							: DateTimeFormat.LongDatePattern,
						(view & DateTimeView.Seconds) == DateTimeView.Seconds
							? DateTimeFormat.LongTimePattern
							: DateTimeFormat.ShortTimePattern);
				}
			return format;
		}

		///// <summary>
		///// Конвертировать строку в Double
		///// </summary>
		///// <param name="s">Строка для конвертации</param>
		///// <returns>Конвертированное значение</returns>
		//public static double ToDouble(string s)
		//{
		//    double textToDouble = 0;
		//    if (!String.IsNullOrEmpty(s))
		//    {
		//        Double.TryParse(s, NumberStyles.Any, PointDecimalSeparator, out textToDouble);
		//    }
		//    return textToDouble;
		//}

		/// <summary>
		/// Конвертировать строку в Decimal
		/// </summary>
		/// <param name="s">Строка для конвертации</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static decimal ToDecimal(string s)
		{
			decimal textToDecimal = 0;
			if (!String.IsNullOrEmpty(s))
			{
				Decimal.TryParse(s, NumberStyles.Any, PointDecimalSeparator, out textToDecimal);
			}
			return textToDecimal;
		}

		/// <summary>
		/// Конвертировать строку в Int32.
		/// Если переданную строку нельзя конвертировать в число, то функция вернет ноль
		/// </summary>
		/// <param name="s">Строка для конвертации</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static int ToInt32(string s)
		{
			int textToInt = 0;
			if (!String.IsNullOrEmpty(s))
			{
				Int32.TryParse(s, out textToInt);
			}
			return textToInt;
		}

		/// <summary>
		/// Конвертировать строку в Int64 (long)
		/// </summary>
		/// <param name="s">Строка для конвертации</param>
		/// <returns>Конвертированное значение</returns>
		/// <remarks>Если передана неправильная, пустая или <c>null</c> строка, то возвращается 0</remarks>
		[Pure]
		public static Int64 ToInt64(string s)
		{
			Int64 textToInt64 = 0;
			if (!String.IsNullOrEmpty(s))
			{
				Int64.TryParse(s, out textToInt64);
			}
			return textToInt64;
		}

		/// <summary>
		/// Конвертировать строку в Guid
		/// </summary>
		/// <param name="s">Строка для конвертации в Guid</param>
		/// <returns>Конвертированное значение</returns>
		[Pure]
		public static Guid ToGuid(string s)
		{
			var guid = Guid.Empty;
			if (!string.IsNullOrEmpty(s))
			{
				Guid.TryParse(s, out guid);
			}
			return guid;
		}


		/// <summary>
		/// Конвертировать массив произвольного типа данных в строку
		/// </summary>
		[Pure]
		public static string ArrayToString<T>(IEnumerable<T> array, Converter<T, string> converter, char separator = ';')
		{
			if (array == null)
			{
				return string.Empty;
			}
			var result = new StringBuilder();
			foreach (var item in array)
			{
				result.Append(converter(item));
				result.Append(separator);
			}
			return result.ToString().Trim(separator);
		}

		/// <summary>
		/// Конвертировать строку в массив произвольного типа данных
		/// </summary>
		[Pure]
		public static T[] StringToArray<T>(string str, Converter<string, T> converter, char separator = ';')
		{
			if (String.IsNullOrEmpty(str))
			{
				return new T[0];
			}
			try
			{
				var strArray = str.Split(separator);
				var result = Array.ConvertAll(strArray, converter);
				return result;
			}
			catch
			{
				return new T[0];
			}
		}
		
	}
}
