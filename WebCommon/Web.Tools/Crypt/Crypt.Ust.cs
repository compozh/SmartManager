using System;
using System.ComponentModel;
using System.Text;

namespace Web.Tools
{
	partial class Crypt
	{
		/// <summary>
		/// Шифрование параметров установки (UST)
		/// </summary>
		/// <exclude />
		[EditorBrowsable(EditorBrowsableState.Never)]
		[Browsable(false)]
		[Obsolete]
		public static class Ust
		{
			private enum CryptTypes
			{
				Encrypt,
				Decrypt
			}

			/// <summary>
			/// Шифрование методом, совместимым с 12 методом VFP-функции encrypt  
			/// </summary>
			/// <param name="str">Строка для шифрования</param>
			/// <param name="key">Ключ шифрования</param>
			/// <returns>Зашифрованная строка</returns>
			public static String Encrypt(String str, String key)
			{
				return crypt(str, key, CryptTypes.Encrypt);
			}

			/// <summary>
			/// Дешифрования методом, совместимым с 12 методом VFP-функции encrypt
			/// </summary>
			/// <param name="str">Строка для дешифрования</param>
			/// <param name="key">Ключ шифрования</param>
			/// <returns>Расшифрованная строка</returns>
			public static String Decrypt(String str, String key)
			{
				return crypt(str, key, CryptTypes.Decrypt);
			}

			/// <summary>
			/// Выполняет шифрование / дешифрование
			/// </summary>
			/// <param name="strIn">Входная строка</param>
			/// <param name="key">Ключ шифрования</param>
			/// <param name="mode">Шифрование / Дешифрование</param>
			/// <returns>Зашифрованную/расшифрованную строку</returns>
			private static String crypt(String strIn, String key, CryptTypes mode)
			{
				// если входная строка пустая - то вернуть пустое значение
				if (String.IsNullOrEmpty(strIn.Trim()) && mode == CryptTypes.Decrypt)
				{
				    return String.Empty;
				}
				Encoding encoding1251 = Encoding.GetEncoding(1251);
				Encoding encoding866 = Encoding.GetEncoding(866);
				// смещение 1: константа для каждого байта
				byte[] str1B = new byte[] {168, 065, 213, 068, 174, 050, 136, 240, 035, 
												 187, 203, 054, 130, 022, 110, 095, 187, 032,
												 169, 021, 177, 081, 233, 007, 015, 122, 177,
												 222, 031, 075};

				int kolsm1 = str1B.Length;
				// смещение 2: по ключу
				byte[] str2B = encoding1251.GetBytes(key);
				int kolsm2 = str2B.Length;

				// смещение 3: сумма символов ключа
				int sm3 = 0;

				for (int iSm2 = 0; iSm2 < kolsm2; iSm2++)
				{
					sm3 = sm3 + str2B[iSm2];
				}
				sm3 = sm3 % 256;

				// смещение 4: номер прошлого символа*ключ
				int sm4 = 0;

				// преобразование кодовых страниц 1251 -> 866
				byte[] str1;
				if (mode == CryptTypes.Encrypt)
				{
					str1 = Encoding.Convert(encoding1251, encoding866, encoding1251.GetBytes(strIn));
				}
				else
				{
					str1 = encoding1251.GetBytes(strIn);
				}

				// количество "символов" во входной строке
				int kolin;
				if (mode == CryptTypes.Encrypt)
				{
					kolin = str1.Length;
				}
				else
				{
					//1 буква исходного слова - два байта зашифрованного
					kolin = str1.Length / 2;
				}
				StringBuilder strout = new StringBuilder(kolin);
				// индекс смещения 1 в массиве str1b
				int i_sm1;
				// индекс смещения 2 в массиве str2b
				int i_sm22;
				// смещение 1
				int sm1;
				// смещение 2
				int sm2;
				// временная переменная для запоминания sm4 при криптовании 
				int sim;
				// временная переменная для запоминания sm4 при декриптовании 
				int sim_;
				// массив для результирующих символов. (так работает быстрее)
				String[] result = new String[kolin];
				for (int iStr = 0; iStr < kolin; iStr++)
				{
					// смещение 1
					i_sm1 = (iStr + 1) % kolsm1;
					if (i_sm1 == 0)
					{
						i_sm1 = kolsm1;
					}
					sm1 = str1B[i_sm1 - 1];
					// смещение 2
					i_sm22 = (iStr + 1) % kolsm2;
					if (i_sm22 == 0)
					{
						i_sm22 = kolsm2;
					}

					i_sm22 = kolsm2 - i_sm22;	// начинаем с конца
					sm2 = str2B[i_sm22];
					// смещение 3 - константа
					// смещение 4 - прошлый символ*символ ключа
					if (sm4 % 16 == 0)
					{
						sm4 = sm4 / 16;
					}
					sm4 = sm4 * sm2 % 256;

					if (mode == CryptTypes.Encrypt)
					{
						// смещаем символ
						sim = ((int)str1[iStr] + sm1 + sm2 + sm3 + sm4) % 256;
						//переводим в 16-ричную СС и записываем в начало строки
						String temp = sim.ToString("X");
						// если число одноразрядное - дописываем ноль в начало

						if (temp.Length == 2)
						{
							result[kolin - iStr - 1] = temp;
						}
						else
						{
							result[kolin - iStr - 1] = "0" + temp;
						}

						// запомнить смещение 4
						sm4 = sim;
					}
					else
					{
						// Расшифровываем строку с конца.
						// циклично получаем по 2 символа с конца зашифрованного слова - 1 буква исходного
						String tmp = encoding1251.GetString(new byte[] { str1[(kolin - iStr) * 2 - 2], str1[(kolin - iStr) * 2 - 1] });
						// переводим в 10-чную СС
						sim_ = Convert.ToInt32(tmp, 16);
						// записываем букву в результат в кодировке win-1251
						strout.Append(encoding1251.GetString(new byte[] { (byte)((sim_ + 256 + 256 + 256 + 256 - sm1 - sm2 - sm3 - sm4) % 256) }));
						// запомнинаем смещение 4
						sm4 = sim_;
					}
				}

				if (mode == CryptTypes.Decrypt)
				{
					// из 866 -> 1251
					byte[] tmp1 = Encoding.Convert(encoding866, encoding1251, encoding1251.GetBytes(strout.ToString()));
					// Конвертация кодовой страницы в 1251
					return encoding1251.GetString(tmp1);
				}
				else
				{
					for (int i = 0; i < kolin; i++)
					{
						strout.Append(result[i]);
					}
					return strout.ToString();
				}
			}
		}
	}
}
