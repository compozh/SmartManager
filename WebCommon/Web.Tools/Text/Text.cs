using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Web.Tools.Properties;

namespace Web.Tools
{
	/// <summary>
	/// Методы для работы с текстом
	/// </summary>
	public static partial class Text
	{
		// Список ключевых слов (не подсвечиваются)
		public static List<string> QuickFilterKeywords = new List<string>{"AND","OR","И","ИЛИ"}; 

		public static readonly NumberFormatInfo PointDecimalSeparator =
			new NumberFormatInfo { NumberDecimalSeparator = ".", NumberGroupSeparator=" " };

		public static readonly Encoding Win1251Encoding = Encoding.GetEncoding(1251);
		public static bool CompareEx(string str1, string str2)
		{
			str1 = trimEndIfNotNullOrEmpty(str1);
			str2 = trimEndIfNotNullOrEmpty(str2);
			return string.Compare(str1, str2, StringComparison.OrdinalIgnoreCase) == 0;
		}
		/// <summary>
		/// Обрезать строку справа, если она не null и не пуста
		/// </summary>
		/// <param name="str">Строка, которую нужно обрезать справа</param>
		/// <returns>Строка без крайних правых пробелов</returns>
		private static string trimEndIfNotNullOrEmpty(string str)
		{
			return String.IsNullOrEmpty(str) ? str : str.TrimEnd();
		}
		
		public static readonly DateTimeFormatInfo DateTimeFormat =
			new DateTimeFormatInfo
			{
				DateSeparator = ".",
				TimeSeparator = ":",
				ShortDatePattern = "dd.MM.yy",
				LongDatePattern = "dd.MM.yyyy",
				ShortTimePattern = "HH:mm",
				LongTimePattern = "HH:mm:ss"
			};

		public static double ToDouble(string number)
		{
			double result;
			Double.TryParse(number, NumberStyles.Any, PointDecimalSeparator, out result);
			return result;
		}

		/// <summary>
		/// Получить строку, которая представляет <paramref name="time"/> для SQL(без милисекунд)
		/// </summary>
		/// <param name="time">Дата-вермя</param>
		/// <returns>Строка для SQL, представляющая дату</returns>
		public static string GetTimeString(DateTime time)
		{
			return time.ToString("yyyyMMdd HH:mm:ss");
		}

		/// <summary>
		/// Преобразовать дату в строку dd.MM.yyyy
		/// </summary>
		/// <param name="date">Дата-вермя</param>
		/// <returns>Преобразованная дата</returns>
		public static string DateFormat(DateTime date)
		{
			if (date == DateTime.MinValue)
			{
				return string.Empty;
			}
			return date.ToString("dd.MM.yyyy");
		}
		
		/// <summary>
		/// Проверить длину текста. Если длина больше заданной, 
		/// записать сообщение об ошибке в <paramref name="errors"/>
		/// </summary>
		/// <param name="text">Текст</param>
		/// <param name="maxLength">Максимальная длина</param>
		/// <param name="columnName">Наименование колонки для исключительной ситуации</param>
		/// <param name="errors">Сообщения об ошибке</param>
		/// <returns>Текст, переданный параметром <paramref name="text"/>.
		/// Если текст null, то возвращается пустая строка</returns>
		public static string CheckMaxTextLength(string text, int maxLength, string columnName, StringBuilder errors)
		{
			if (text == null)
			{
				return string.Empty;
			}
			if (maxLength > 0 && text.Length > maxLength)
			{
				errors.AppendFormat(Resource.WrongFieldLength, columnName, maxLength);
				errors.Append("<br/>");
			}
			return text;
		}

		/// <summary>
		/// Проверить длину текста. Если длина больше заданной, 
		/// записать сообщение об ошибке в <paramref name="errors"/>
		/// </summary>
		/// <param name="text">Текст</param>
		/// <param name="minLength">Минимальная длина</param>
		/// <param name="columnName">Наименование колонки для исключительной ситуации</param>
		/// <param name="errors">Сообщения об ошибке</param>
		/// <returns>Текст, переданный параметром <paramref name="text"/>.
		/// Если текст null, то возвращается пустая строка</returns>
		public static string CheckMinTextLength(string text, int minLength, string columnName, StringBuilder errors)
		{
			if (text == null)
			{
				return string.Empty;
			}
			if (text.Length < minLength)
			{
				errors.AppendFormat(Resource.MinFieldLength, columnName, minLength);
				errors.Append("<br/>");
			}
			return text;
		}

		public static void CheckRequired(string text, string columnName, StringBuilder errors)
		{
			if (String.IsNullOrWhiteSpace(text))
			{
				errors.AppendFormat(Resource.RequireField, columnName);
				errors.Append("<br/>");
			}
		}

		/// <summary>
		/// Вычислить рейтинг строки (для релевантного поиска)
		/// </summary>
		/// <param name="text">Строка</param>
		/// <param name="words">Слова</param>
		/// <returns></returns>
		public static int GetStringRating(string text, List<string> words)
		{
			return words.FindAll(word => text.ToUpper().Contains(word)).Count;
		}

		/// <summary>
		/// Вычислить рейтинг строки (для релевантного поиска)
		/// </summary>
		/// <param name="text">Строка</param>
		/// <param name="wordsText">Слова в виде строки</param>
		/// <returns></returns>
		public static int GetStringRating(string text, string wordsText)
		{
			var words = wordsText.Split(' ').ToList().ConvertAll(w => w.Trim().ToUpper()).ToList();
			words.RemoveAll(word => word.Equals(string.Empty));
			return GetStringRating(text, words);
		}

		/// <summary>
		/// Подсветить фразы синим цветом в html
		/// </summary>
		/// <param name="text">html</param>
		/// <param name="words">Список фраз для подсветки</param>
		/// <returns>html с подсветкой слов синим цветом</returns>
		public static string HighlightText(string text, List<string> words)
		{
			if (string.IsNullOrEmpty(text) || words == null || words.Count == 0)
			{
				return text ?? string.Empty;
			}
			text = text.Trim();
			// Пройтись по всем словам.
			// Найти все вхождение слова в строку, заменить слово на html, который "подсветит" найденное слово
			foreach (var word in words)
			{
				if (string.IsNullOrEmpty(word))
				{
					continue;
				}
				// Проверяем является ли полученное слово ключевым
				if (!QuickFilterKeywords.Contains(word.ToUpper()))
				{
					var indexOfWord = -1;
					// Позиция слова для поиска
					indexOfWord = text.IndexOf(word, indexOfWord + 1, StringComparison.OrdinalIgnoreCase);
					// Заменять все вхождения слова
					while (indexOfWord > -1)
					{
						// Слово в исходной строке (используем именно его - для сохранения регистра символов)
						var casedWord = text.Substring(indexOfWord, word.Length);
						// Удалить искомое слово
						text = text.Remove(indexOfWord, word.Length);
						var highlightString = string.Format("<span class=\"blue\">{0}</span>", casedWord);
						// Вставить html, который "подстветит" слово
						text = text.Insert(indexOfWord, highlightString);
						indexOfWord = text.IndexOf(word, indexOfWord + highlightString.Length, StringComparison.OrdinalIgnoreCase);
					}
				}
			}
			return text;
		}

		/// <summary>
		/// Подвесвить фразы в html
		/// </summary>
		/// <param name="text">html</param>
		/// <param name="wordsText">Слова, разделенные пробелом</param>
		/// <returns>html с подсветкой слов синим цветом</returns>
		public static string HighlightText(string text, string wordsText)
		{
			if (!string.IsNullOrEmpty(text))
			{
				// Найти слова, обрезать крайние пробелы, удалить пустые слова
				var words = wordsText.Split(' ').ToList();
				words = words.Select(w => w.Trim()).ToList();
				words.RemoveAll(word => word.Equals(string.Empty));
				return HighlightText(text, words);
			}
			return text;
		}

		/// <summary>
		/// Разбить строку на список словам. Слова обрезаются слева и справа и удаляются пустые слова
		/// </summary>
		/// <param name="text"></param>
		/// <returns></returns>
		public static List<string> SplitToWords(string text)
		{
			if (!string.IsNullOrEmpty(text))
			{
				// Найти слова, обрезать крайние пробелы, удалить пустые слова
				var words = text.Split(' ').ToList();
				words = words.Select(w => w.Trim()).ToList();
				words.RemoveAll(word => word.Equals(string.Empty));
				return words;
			}
			return new List<string>();
		}

		/// <summary>
		/// Обрезать текст
		/// </summary>
		/// <param name="stringToTrim">Текст</param>
		/// <returns>Обрезанный текст</returns>
		public static string Trim(string stringToTrim)
		{
			if (stringToTrim == null)
			{
				return null;
			}
			return stringToTrim.Trim();
		}

		private const int _shortFileNameLength = 12;

		/// <summary>
		/// Получить сокращенное имя файла
		/// </summary>
		/// <param name="fileName">Имя файла</param>
		/// <returns>Сокращенное имя файла</returns>
		public static string CreateShortFileName(string fileName)
		{
			return String.Concat(Left(fileName, _shortFileNameLength), fileName.Length > _shortFileNameLength ? "..." : string.Empty);
		}
		
		/// <summary>
		/// Дополнить строку справа пробелами до достижения необходимой длины
		/// </summary>
		/// <param name="str">Строка</param>
		/// <param name="requireLength">Необходимая длина</param>
		/// <returns>Дополненная строка</returns>
		public static string PadRight(string str, int requireLength)
		{
			if (string.IsNullOrEmpty(str))
			{
				return new string(' ', requireLength);
			}
			return str.PadRight(requireLength, ' ');
		}

		const string _timeStampFormat = "yyyyMMddHHmmss";

		/// <summary>
		/// Строка является числом
		/// </summary>
		/// <param name="s">Проверяемая строка</param>
		/// <param name="numberHasDot">Может содержать точку-разделитель целой и дробной частей. По умолчанию - может содержать</param>
		/// <returns></returns>
		public static bool IsNumber(string s, bool numberHasDot = true)
		{
			if (string.IsNullOrEmpty(s))
			{
				return false;
			}
			bool hasDot = !numberHasDot;
			// Проверить, является ли число отрицательным
			bool isNegative = s[0] == '-';
			// Проверить, чтобы строка не состоялась только с минуса
			if (isNegative && s.Length == 1)
			{
				return false;
			}
			for (var i = isNegative ? 1 : 0; i < s.Length; i++)
			{
				var c = s[i];
				if (c == '.')
				{
					if (hasDot)
					{
						return false;
					}
					hasDot = true;
					continue;
				}
				if (!Char.IsDigit(c))
				{
					return false;
				}
			}
			return true;
		}
		
		/// <summary>
		/// Дополнить строку слева до нужной длины пробелами или другим символом
		/// </summary>
		/// <param name="text">Текст</param>
		/// <param name="totalWidth">Требуемая длина. Если входная строка превышает <paramref name="totalWidth"/>, то она будет усечена</param>
		/// <param name="paddingChar">Символ, которым дополнить</param>
		/// <returns></returns>
		/// <remarks>Аналог VFP-функции padl()</remarks>
		public static string PadLeft(string text, int totalWidth, char paddingChar = ' ')
		{
			return Left(text, totalWidth).PadLeft(totalWidth, paddingChar);
		}
		
		public static string Convert(decimal value, int precision, bool thousandSeparator = false)
		{
			var mask = String.Concat(thousandSeparator ? "#," : string.Empty, 
				"0", PointDecimalSeparator.NumberDecimalSeparator, new string('0', precision));
			return value.ToString(mask, PointDecimalSeparator);
		}

		
		/// <summary>
		/// Получить подстроку с начала строки
		/// </summary>
		/// <param name="str">Строка</param>
		/// <param name="length">Длина подстроки</param>
		/// <returns>Подстрока</returns>
		public static string Left(string str, int length)
		{
			return Substring(str, 0, length);
		}

		/// <summary>
		/// Получить подстроку
		/// </summary>
		/// <param name="str">Строка</param>
		/// <param name="start">Индекс начала подстроки</param>
		/// <param name="length">Длина подстроки</param>
		/// <returns>Подстрока</returns>
		public static string Substring(string str, int start, int length)
		{
			if (string.IsNullOrEmpty(str))
			{
				return string.Empty;
			}
			if (start + length > str.Length)
			{
				return str.Substring(start);
			}
			return str.Substring(start, length);
		}

		/// <summary>
		/// Получить подстроку, начиная с индекса <paramref name="start"/> до конца строки
		/// </summary>
		/// <param name="str">Строка</param>
		/// <param name="start">Индекс начала подстроки</param>
		/// <returns>Подстрока</returns>
		public static string Substring(string str, int start)
		{
			if (string.IsNullOrEmpty(str))
			{
				return string.Empty;
			}
			return Substring(str, start, str.Length - start);
		}

		

		/// <summary>
		/// Получить укороченное наименование файла
		/// </summary>
		/// <param name="name">Наименование файла</param>
		/// <param name="length">Необходимая длина наименования</param>
		/// <returns>Укороченное наименование файла</returns>
		public static string GetShortFileName(string name, int length)
		{
			if (length == 0)
			{
				return name;
			}
			var extension = Path.GetExtension(name);
			var shortName = Left(Path.GetFileNameWithoutExtension(name), length);
			return Path.ChangeExtension(shortName, extension);
		}

	
	}
}