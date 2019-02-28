using System.Collections.Generic;
using System.Text;

namespace Web.Tools
{
	partial class Text
	{
		/// <summary>
		/// Обработка специальных символов в тексте
		/// </summary>
		public static class SpecialSymbols
		{
			private const string _mark = "#";

			/// <summary>
			/// Кодировать специальные символы
			/// </summary>
			/// <param name="sourceString"></param>
			/// <param name="specialSymbols"></param>
			/// <returns></returns>
			/// <remarks>Аналог VFP функции EncSpecS</remarks>
			public static string Encrypt(string sourceString, string specialSymbols = "()|;[]")
			{
				if (string.IsNullOrEmpty(sourceString) || string.IsNullOrEmpty(specialSymbols))
				{
					return sourceString;
				}
				var sb = new StringBuilder(sourceString);
				bool modified = false;
				foreach (var specialSymbol in specialSymbols)
				{
					string symbol = specialSymbol.ToString();
					if (sourceString.Contains(symbol))
					{
						string replaceString = _mark + ((int)specialSymbol).ToString("000");
						sb.Replace(symbol, replaceString);
						modified = true;
					}
				}
				return modified ? sb.ToString() : sourceString;
			}

			/// <summary>
			/// Раскодировать специальные вставки
			/// </summary>
			/// <param name="encryptedString"></param>
			/// <returns></returns>
			/// <remarks>Аналог VFP функции DecSpecS</remarks>
			public static string Decrypt(string encryptedString)
			{
				if (string.IsNullOrEmpty(encryptedString))
				{
					return encryptedString;
				}
				int searchIndex = 0;
				var indexes = new List<int>();
				var chars = new List<char>();

				const int charCodeLength = 3; // Длина кода символа в строке
				// Найти все вхождения "#"+3 цифры в строке
				while (true)
				{
					int markIndex = encryptedString.IndexOf(_mark, searchIndex);
					if (markIndex < 0 || encryptedString.Length - markIndex < charCodeLength)
					{
						break;
					}
					string charCode = encryptedString.Substring(markIndex + 1, charCodeLength);
					if (IsNumber(charCode))
					{
						char symbol = (char)ToInt32(charCode);
						indexes.Add(markIndex);
						chars.Add(symbol);
					}
					searchIndex = markIndex + 1;
				}

				// Заменить 
				if (indexes.Count > 0)
				{
					var indexesArray = indexes.ToArray();
					var charsArray = chars.ToArray();
					var sb = new StringBuilder(encryptedString);
					for (int i = indexesArray.Length - 1; i >= 0; i--)
					{
						int index = indexesArray[i];
						char symbol = charsArray[i];
						sb.Remove(index, charCodeLength + 1);
						sb.Insert(index, symbol);
					}
					return sb.ToString();
				}
				return encryptedString;
			}
		}
	}
}
