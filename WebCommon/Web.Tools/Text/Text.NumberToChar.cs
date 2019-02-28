using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading;
using Web.Tools.Properties;

namespace Web.Tools
{
	partial class Text
	{
		/// <summary>
		/// Преобразовать целое число в символьное выражение "число прописью"
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="lang">Язык, на котором будет возвращено число прописью</param>
		/// <returns>Число прописью</returns>
		/// <exception cref="ArgumentOutOfRangeException">Выход числа за пределы допустимого диапазона</exception>
		public static string NumberToChar(long number, Language lang)
		{
			return numberToChar(number, CultureFromLanguage(lang));
		}

		/// <summary>
		/// Преобразовать целое число в символьное выражение "число прописью" на текущем языке локализации
		/// </summary>
		/// <param name="number">Число</param>
		/// <returns>Число прописью</returns>
		public static string NumberToChar(long number)
		{
			return numberToChar(number, Thread.CurrentThread.CurrentCulture);
		}

		/// <summary>
		/// Преобразовать целое число в символьное выражение "число прописью"
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="lang">Язык, на котором будет возвращено число прописью</param>
		/// <param name="gender">Род выводимого числа </param>
		/// <returns>Число прописью</returns>
		/// <exception cref="ArgumentOutOfRangeException">Выход числа за пределы допустимого диапазона</exception>
		public static string NumberToChar(long number, Language lang, Gender gender)
		{
			var culture = CultureFromLanguage(lang);
			return numberToChar(number, culture, gender);
		}

		/// <summary>
		/// Преобразовать дробное число в символьное выражение "число прописью"
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="lang">Язык, на котором будет возвращено число прописью</param>
		/// <returns>Число прописью</returns>
		public static string NumberToChar(decimal number, Language lang)
		{
			return decimalToChar(number, CultureFromLanguage(lang));
		}

		/// <summary>
		/// Преобразовать дробное число в символьное выражение "число прописью" на текущем языке локализации
		/// </summary>
		/// <param name="number">Число</param>
		/// <returns>Число прописью</returns>
		public static string NumberToChar(decimal number)
		{
			return decimalToChar(number, Thread.CurrentThread.CurrentCulture);
		}

		/// <summary>
		/// Преобразовать дробное число в символьное выражение "число прописью"
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="culture">Культура, соответствующая языку</param>
		/// <returns>Число прописью</returns>
		private static string decimalToChar(decimal number, CultureInfo culture)
		{
			const string separatorEn = "POINT";
			// Целая часть числа
			var intPart = (int)number;
			var fraction = number - intPart;
			// Дробная часть числа, представленная в виде Integer
			var fractionPart = System.Convert.ToInt32((double)fraction * Math.Pow(10, Convert(fraction).Length - 2));
			// Обозначения для целой части (целая, целых..)
			var intDesignations = new[] {
	            Resource.ResourceManager.GetString("Integral1", culture),
	            Resource.ResourceManager.GetString("Integral2", culture)
            };
			// Обозначения для дробной части (десятая, десятых, сотых, тысячных...)
			var fractionDesignations = new[] {
	            new[] { "", "", "" },
	            new[] {
	                Resource.ResourceManager.GetString("Tenth1", culture),
	                Resource.ResourceManager.GetString("Tenth2", culture)
	            },
	            new[] {
	                Resource.ResourceManager.GetString("Hundredth1", culture),
	                Resource.ResourceManager.GetString("Hundredth2", culture)
	            },
	            new[] {
	                Resource.ResourceManager.GetString("Thousandth1", culture),
	                Resource.ResourceManager.GetString("Thousandth2", culture)
	            }
	        };
			// Длина дробной части
			var fractionLength = Convert(fraction).Length - 2;
			// Обозначение для дробной части обрабатывается только до тысячных
			// Для decimal без дробной части, выводить только значение целых
			if (fractionLength > 3 || fractionLength < 0)
			{
				return numberToChar(intPart, culture).Trim();
			}
			var isLanguageEn = LanguageFromCulture(culture) == Language.En;
			var intSeparator = isLanguageEn ? separatorEn : getCaseNumberText(intPart, intDesignations);
			var stringNumber = new StringBuilder();
			stringNumber.Append(numberToChar(intPart, culture, Gender.Female).Trim());
			stringNumber.AppendFormat(" {0}", intSeparator);
			// Вычисление разряда числа в дробной части (только для англ. языка)
			if (isLanguageEn)
			{
				stringNumber.AppendFormat(" {0}", numberToCharEn(fractionPart, fractionLength, culture));
			}
			else
			{
				stringNumber.AppendFormat(" {0}", numberToChar(fractionPart, culture, Gender.Female).Trim());
				stringNumber.AppendFormat(" {0}", getCaseNumberText(fractionPart, fractionDesignations[fractionLength]));
			}
			return stringNumber.ToString();
		}

		private static string numberToCharEn(long fractionPart, int fractionLength, CultureInfo culture)
		{
			var result = new StringBuilder();
			// количество нулей в дробной части
			var zeroCount = fractionLength - Convert(fractionPart).Length;
			if (zeroCount > 0)
			{
				for (int i = 0; i < zeroCount; i++)
				{
					result.Append("ZERO ");
				}
			}
			result.Append(numberToChar(fractionPart, culture, Gender.Female).Trim());
			return result.ToString();
		}
		private static string numberToChar(long number, CultureInfo culture, Gender gender = Gender.None)
		{
			if (Math.Abs(number) > 999999999999)
			{
				throw new ArgumentOutOfRangeException("number", Resource.IntToCharError);
			}

			// Числа от 3 до 19 прописью
			string[] firstTwenty =
            {
				Resource.ResourceManager.GetString("Three", culture),
				Resource.ResourceManager.GetString("Four", culture),
				Resource.ResourceManager.GetString("Five", culture),
				Resource.ResourceManager.GetString("Six", culture),
				Resource.ResourceManager.GetString("Seven", culture),
				Resource.ResourceManager.GetString("Eight", culture),
				Resource.ResourceManager.GetString("Nine", culture),
				Resource.ResourceManager.GetString("Ten", culture),
				Resource.ResourceManager.GetString("Eleven", culture),
				Resource.ResourceManager.GetString("Twelve", culture),
				Resource.ResourceManager.GetString("Thirteen", culture),
				Resource.ResourceManager.GetString("Fourteen", culture),
				Resource.ResourceManager.GetString("Fifteen", culture),
				Resource.ResourceManager.GetString("Sixteen", culture),
				Resource.ResourceManager.GetString("Seventeen", culture),
				Resource.ResourceManager.GetString("Eighteen", culture),
				Resource.ResourceManager.GetString("Nineteen", culture)
			};

			// Один и два в женском и мужском роде
			string[,] oneTwo = 
            {
				{
					Resource.ResourceManager.GetString("OneM", culture),
					Resource.ResourceManager.GetString("OneF", culture)
				}, 
                {
					Resource.ResourceManager.GetString("TwoM", culture),
					Resource.ResourceManager.GetString("TwoF", culture)
				}
			};

			// Десятки прописью
			string[] tens = 
            {
				Resource.ResourceManager.GetString("Twenty", culture),
				Resource.ResourceManager.GetString("Thirty", culture),
				Resource.ResourceManager.GetString("Forty", culture),
				Resource.ResourceManager.GetString("Fifty", culture),
				Resource.ResourceManager.GetString("Sixty", culture),
				Resource.ResourceManager.GetString("Seventy", culture),
				Resource.ResourceManager.GetString("Eighty", culture),
				Resource.ResourceManager.GetString("Ninety", culture)
			};

			// Сотни прописью
			string[] hundreds = 
            {
				Resource.ResourceManager.GetString("OneHundred", culture),
				Resource.ResourceManager.GetString("TwoHundred", culture),
				Resource.ResourceManager.GetString("ThreeHundred", culture),
				Resource.ResourceManager.GetString("FourHundred", culture),
				Resource.ResourceManager.GetString("FiveHundred", culture),
				Resource.ResourceManager.GetString("SixHundred", culture),
				Resource.ResourceManager.GetString("SevenHundred", culture),
				Resource.ResourceManager.GetString("EightHundred", culture),
				Resource.ResourceManager.GetString("NineHundred", culture)
			};

			// Тысяча, миллион, миллиард в разных падежах
			string[,] triads = 
            {
				{
					Resource.ResourceManager.GetString("Thousand1", culture),
					Resource.ResourceManager.GetString("Thousand2", culture),
					Resource.ResourceManager.GetString("Thousand5", culture)
				}, 
                {
					Resource.ResourceManager.GetString("Million1", culture),
					Resource.ResourceManager.GetString("Million2", culture),
					Resource.ResourceManager.GetString("Million5", culture)
				}, 
                {
					Resource.ResourceManager.GetString("Billion1", culture),
					Resource.ResourceManager.GetString("Billion2", culture),
					Resource.ResourceManager.GetString("Billion5", culture)
				}
			};

			// Максимальное количество триад
			const int triadMax = 4;

			var result = new StringBuilder();

			// Прибавить к числу "МИНУС" если необходимо и использовать модуль числа
			if (number < 0)
			{
				result.Append(Resource.ResourceManager.GetString("Minus", culture));
				number = Math.Abs(number);
			}

			//Строковое представление числа цифрами
			string intStr = number.ToString("D12", CultureInfo.InvariantCulture);

			// Разобрать число на триады и написать каждую триаду прописью
			for (int i = 0; i < triadMax; i++)
			{
				string triad = intStr.Substring(i * 3, 3);	  // получаем следующую триаду	 
				int intTriad = Int32.Parse(triad);

				if (intTriad > 0)
				{
					NumberCase triadCase;
					int hundred = Int32.Parse(triad.Substring(0, 1)); // получить количество сотен в триаде
					int ten = Int32.Parse(triad.Substring(1, 1));    // получить количество десятков в триаде 
					int one = Int32.Parse(triad.Substring(2, 1));    // получить количество единиц в триаде

					// Если необходимо, то добавить сотни прописью
					if (hundred > 0)
					{
						result.AppendFormat(" {0}", hundreds[hundred - 1]);
					}

					// Если необходимо, то добавить десятки прописью
					if (ten > 1)
					{
						result.AppendFormat(" {0}", tens[ten - 2]);
					}
					else
					{
						one = ten * 10 + one;
					}

					// Если необходимо, то добавить число от 1 до 19 прописью
					if (one > 0)
					{
						if (one == 1 || one == 2)
						{
							int param;
							if (gender != Gender.None && i == triadMax - 1)
							{
								param = gender == Gender.Male ? 0 : 1;
							}
							else
							{
								param = triadMax - i == 2 ? 1 : 0;
							}
							result.AppendFormat(" {0}", oneTwo[one - 1, param]);
						}
						else
						{
							result.AppendFormat(" {0}", firstTwenty[one - 3]);
						}
					}
					result.Append(" ");

					// Определить падеж названия триады
					if (one == 1)
					{
						triadCase = NumberCase.One;
					}
					else if (one > 1 && one < 5)
					{
						triadCase = NumberCase.Two;
					}
					else
					{
						triadCase = NumberCase.Five;
					}

					// Добавляем название триады
					if (i != triadMax - 1)
					{
						result.Append(triads[triadMax - i - 2, (int)triadCase]);
					}
				}
			}

			// Прибавление "НОЛЬ" к результату если необходимо
			if (number == 0)
			{
				result.Append(Resource.ResourceManager.GetString("Zero", culture));
			}

			return result.ToString().Trim();
		}

		/// <summary>
		/// Получить культуру по элементу перечисления Language
		/// </summary>
		/// <param name="lang">Элемент перечисления Language</param>
		/// <returns>Культура, соответствующая переданному языку</returns>
		internal static CultureInfo CultureFromLanguage(Language lang)
		{
			switch (lang)
			{
				case Language.Ru:
					return new CultureInfo("ru");
				case Language.Uk:
					return new CultureInfo("uk");
				case Language.En:
					return new CultureInfo("en");
				default:
					return Thread.CurrentThread.CurrentCulture;
			}
		}

		/// <summary>
		/// Получить <see cref="Text.Language"/> по указанной культуре
		/// </summary>
		/// <param name="cultureInfo">Культура, соответствующая переданному языку</param>
		internal static Language LanguageFromCulture(CultureInfo cultureInfo)
		{
			switch (cultureInfo.TwoLetterISOLanguageName)
			{
				case "uk":
					return Language.Uk;
				case "en":
					return Language.En;
				default:
					return Language.Ru;
			}
		}


		/// <summary>
		/// Получить падеж числа
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="titles">Целая (дробная) часть в соответствующем падеже</param>
		private static string getCaseNumberText(long number, IList<string> titles)
		{
			var twoLastDigits = number % 100;
			// Обработка чисел 2 - 20 для рус., укр. яз.; множественного числа для наименования на английском языке
			if (twoLastDigits > 1 && twoLastDigits < 21)
			{
				return titles[1];
			}
			// Обработка всех остальных чисел, для всех значений единиц
			// Получение последней цифры числа
			number = number % 10;
			if (number == 1)
			{
				return (titles[0]);
			}
			if (number > 1 || number == 0)
			{
				return titles[1];
			}
			return string.Empty;
		}

		/// <summary>
		/// Получить падеж валюты для суммы прописью
		/// </summary>
		/// <param name="number">Число</param>
		/// <param name="titles">Названия валют в соответствующем падеже</param>
		private static string getCaseNumberTextForSum(long number, IList<string> titles)
		{
			var twoLastDigits = number % 100;
			// Обработка чисел 2 - 20 для рус., укр. яз.;
			if (twoLastDigits > 1 && twoLastDigits < 5)
			{
				return titles[1];
			}
			if (twoLastDigits > 4 && twoLastDigits < 21)
			{
				return titles[2];
			}
			// Обработка всех остальных чисел, для всех значений единиц
			// Получение последней цифры числа
			number = number % 10;
			if (number == 1)
			{
				return (titles[0]);
			}
			if (number > 1 && number < 5)
			{
				return titles[1];
			}
			if (number > 4 || number == 0)
			{
				return (titles[2]);
			}
			return string.Empty;
		}

		/// <summary>
		/// Падеж валюты и названий триад
		/// Например:
		/// 1 тысяча
		/// 2,3,4 тысячи
		/// 5, 6 тысяч
		/// </summary>
		private enum NumberCase
		{
			One,
			Two,
			Five
		}

		/// <summary>
		/// Язык, на котором будет возвращена сумма прописью
		/// </summary>
		public enum Language
		{
			/// <summary>
			/// Русский язык
			/// </summary>
			Ru = 1,
			/// <summary>
			/// Украинский язык
			/// </summary>
			Uk = 2,
			/// <summary>
			/// Английский язык
			/// </summary>
			En = 3
		}

		/// <summary>
		/// Род, в котором будет возвращаться число прописью
		/// </summary>
		public enum Gender
		{
			/// <summary>
			/// Мужской род
			/// </summary>
			
			Male,
			/// <summary>
			/// Женской род
			/// </summary>
			
			Female,
			/// <summary>
			/// Не учитывать
			/// </summary>
			
			None
		}
	}
}