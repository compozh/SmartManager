using System;
using System.Collections;
using System.Collections.Generic;

namespace Web.Tools
{
	partial class Text
	{
		///<summary>
		/// Используется для разбора параметров, полученных из foxpro
		///</summary>
		public class Param2Var : IEnumerable<KeyValuePair<string,string>>
		{
			private readonly Dictionary<string, string> _paramsValue = new Dictionary<string, string>();

			///<summary>
			/// Конструктор
			///</summary>
			///<param name="paramString">Строка параметров</param>
			///<param name="separator">Разделитель ключа и значения. По умолчанию ":"</param>
			public Param2Var(string paramString, char separator = ':')
			{
				// Расшифровка строки параметров
				if (!String.IsNullOrEmpty(paramString))
				{
					const char symbol1 = '/';
					const char symbol3 = '"';
					string resultString = paramString.Trim();
					while (!String.IsNullOrEmpty(resultString))
					{
						int nom2 = resultString.IndexOf(separator); // Находим первую позицию символа :
						if (nom2 < 0)
						{
							resultString = "";
							continue;
						}
						int nom1 = resultString.LastIndexOf(symbol1, nom2); // Находим первую позицию символа /
						if (nom1 < 0)
						{
							resultString = resultString.Substring(nom2 + 1);
							continue;
						}
						nom1++;
						string key = resultString.Substring(nom1, nom2 - nom1);
						resultString = resultString.Substring(nom2 + 1);
						string value;
						if (resultString.IndexOf(symbol3) == 0 && resultString.IndexOf(symbol3, 1) > 0)
						{
							nom1 = 1;
							nom2 = resultString.IndexOf(symbol3, nom1);
							value = resultString.Substring(nom1, nom2 - nom1);
							resultString = resultString.Substring(nom2 + nom1).TrimStart();
						}
						else
						{
							nom1 = 0;
							nom2 = resultString.IndexOf(symbol1, nom1);
							if (nom2 < 0)
							{
								nom2 = resultString.Length;
							}
							value = resultString.Substring(nom1, nom2).TrimEnd();
							resultString = resultString.Substring(nom2);
						}
						if (_paramsValue.ContainsKey(key))
						{
							_paramsValue[key] = value;
						}
						else
						{
							_paramsValue.Add(key, value);
						}
					}
				}
			}

			///<summary>
			/// Получить значение по указанному ключу
			///</summary>
			///<param name="key">Ключ</param>
			public string this[string key]
			{
				get
				{
					string result;
					if (!_paramsValue.TryGetValue(key, out result))
					{
						result = string.Empty;
					}
					return result;
				}
			}

			/// <summary>
			/// Проверить наличие параметра по указанному ключу
			/// </summary>
			/// <param name="key">Ключ</param>
			/// <returns></returns>
			public bool ContainsKey(string key)
			{
				return _paramsValue.ContainsKey(key);
			}

			public IEnumerator<KeyValuePair<string, string>> GetEnumerator()
			{
				foreach (var paramKey in _paramsValue)
				{
					yield return paramKey;
				}
			}

			IEnumerator IEnumerable.GetEnumerator()
			{
				return GetEnumerator();
			}
		}
	}
}
