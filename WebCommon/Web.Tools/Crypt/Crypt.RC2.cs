using System;
using System.Text;

namespace Web.Tools
{
	partial class Crypt
	{
		/// <summary>
		/// Шифрование методом RC2
		/// </summary>
        public static partial class RC2
		{
			/// <summary>
			/// Шифрование методом, совместимым с VFP-функцией CryptSymm
			/// </summary>
			/// <param name="dataIn">Строка для шифрования</param>
			/// <param name="password">Ключ шифрования</param>
			/// <returns>Зашифрованная строка</returns>
			/// <exception cref="System.SystemException" />
			public static string Encrypt(string dataIn, string password)
			{
				return Crypt(dataIn, password, new CryptFunction(CallCryptEncrypt));
			}

			/// <summary>
			/// Дешифрования методом, совместимым с VFP-функцией CryptSymm
			/// </summary>
			/// <param name="dataIn">Строка для дешифрования</param>
			/// <param name="password">Ключ шифрования</param>
			/// <returns>Расшифрованная строка</returns>
			/// <exception cref="System.SystemException">Password не соответствует dataIn</exception>
			public static string Decrypt(string dataIn, string password)
			{
				if (string.IsNullOrWhiteSpace(dataIn))
				{
					return string.Empty;
				}
				return Crypt(dataIn, password, CallCryptDencrypt);
			}

			/// <summary>
			/// Выполняет шифрование / дешифрование
			/// </summary>
			/// <param name="dataIn">Входная строка</param>
			/// <param name="password">Пароль шифрования</param>
			/// <param name="callCryptFunction">Ссылка на функцию, которая выполняет шифрование/дешифрование</param>
			/// <returns></returns>
			private static string Crypt(string dataIn, string password, CryptFunction callCryptFunction)
			{
				// Кодировка текста
				Encoding win1251 = Encoding.GetEncoding(1251);

				// Указатели на объекты шифрования
				IntPtr provHandle = IntPtr.Zero;
				IntPtr keyHandle = IntPtr.Zero;
				IntPtr hashHandle = IntPtr.Zero;

				// Подготовить буфер данных
				uint dataLength = (uint)win1251.GetByteCount(dataIn); // Длина входной строки в байтах
				byte[] data = new byte[dataLength + RC2_BLOCK_SIZE]; // Буфер для предачи данных в API-функции. Должен быть больше входной строки на размер блока шифрования
				Buffer.BlockCopy(win1251.GetBytes(dataIn), 0, data, 0, (int)dataLength); // Скопировать входную строку в буфер

				// Выходная строка
				string dataOut = string.Empty;

				bool ret = true;

				try
				{
					// Получение ключа из пароля 
					if (ret && !CryptAcquireContext(out provHandle, null, MS_DEF_PROV, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT))
					{
						ret = false;
						HandleError("CryptAcquireContext");
					}
					if (ret && !CryptCreateHash(provHandle, CALG_MD5, IntPtr.Zero, 0, out hashHandle))
					{
						ret = false;
						HandleError("CryptCreateHash");
					}
					if (ret && !CryptHashData(hashHandle, password, (uint)password.Length, 0))
					{
						ret = false;
						HandleError("CryptHashData");
					}
					if (ret && !CryptDeriveKey(provHandle, CALG_RC2, hashHandle, 0, out keyHandle))
					{
						ret = false;
						HandleError("CryptDeriveKey");
					}

					// Шифрование
					if (ret && !callCryptFunction(keyHandle, data, ref dataLength))
					{
						// Обработка ошибок выполняется внутри RC2CallCryptDencrypt/RC2CallCryptEncrypt
					}

					// Преобразовать буфер в строку. Обрезать лишние байты в конце
					if (ret)
					{
						dataOut = Encoding.GetEncoding(1251).GetString(data, 0, (int)dataLength);
					}

				}
				finally
				{
					// Почистить все указатели
					if (keyHandle != IntPtr.Zero)
					{
						CryptDestroyKey(keyHandle);
						keyHandle = IntPtr.Zero;
					}
					if (provHandle != IntPtr.Zero)
					{
						CryptReleaseContext(provHandle, 0);
						provHandle = IntPtr.Zero;
					}
					if (hashHandle != IntPtr.Zero)
					{
						CryptDestroyHash(hashHandle);
						hashHandle = IntPtr.Zero;
					}
				}
				return dataOut;
			}

			// Обработка ошибок
			private static void HandleError(string funcName)
			{
				uint lastError = GetLastError();
				const uint bufferSize = 500;
				StringBuilder sb = new StringBuilder((int)bufferSize);

				try
				{
					// get message for last error
					FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, null, lastError, 0, sb, bufferSize, null);
				}
				catch
				{
					// error calling FormatMessage
					sb.Append("N/A.");
				}

				throw new SystemException(
					string.Format("Crypt failed.\r\nFunction: {0}\r\nLast error: 0x{1:x}\r\nError message: {2}",
					funcName, lastError, sb.ToString()));
			}


			// Вызов функции шифрования
			private static bool CallCryptEncrypt(IntPtr keyHandle, byte[] data, ref uint dataLength)
			{
				if (!CryptEncrypt(keyHandle, IntPtr.Zero, true, 0, data, ref dataLength, (uint)(data.Length)))
				{
					HandleError("CryptEncrypt");
					return false;
				}
				return true;
			}

			// Вызов функции дешифрования
			private static bool CallCryptDencrypt(IntPtr keyHandle, byte[] data, ref uint dataLength)
			{
				if (!CryptDecrypt(keyHandle, IntPtr.Zero, true, 0, data, ref dataLength))
				{
					HandleError("CryptDecrypt");
					return false;
				}
				return true;
			}

			// Делегат для вызова функций CryptEncrypt, CryptDecrypt
			// Нужен чтобы избежать дублирования кода
			private delegate bool CryptFunction(IntPtr keyHandle, byte[] data, ref uint dataLength);
		}
	}
}
