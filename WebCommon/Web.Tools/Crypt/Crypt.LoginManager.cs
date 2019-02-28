using System;
using System.ComponentModel;
using System.Text;

namespace Web.Tools
{
	partial class Crypt
	{
		/// <summary>
		/// Шифрование данных при авторизации
		/// </summary>
		/// <exclude />
		[EditorBrowsable(EditorBrowsableState.Never)]
		[Browsable(false)]
		public static class LoginManager
		{
			/// <summary>
			/// Зашифровать пароль пользователя к виду TBN2
			/// </summary>
			/// <param name="pass">пароль</param>
			/// <param name="saps">соль</param>
			/// <param name="userId">ИД пользователя</param>
			/// <returns></returns>
			/// <exclude />
			[EditorBrowsable(EditorBrowsableState.Never), Browsable(false)]
			public static string CryptUserPass(string pass, string saps, string userId)
			{
				// Строка для вычисления хеша
				string stringToHash;
				if (userId.StartsWith("*"))
				{
					stringToHash = string.Format("{0}{1}", pass.TrimEnd(), saps.TrimEnd());
				}
				else
				{
					stringToHash = (pass.TrimEnd().Length > 10 ? pass.TrimEnd().PadRight(30) : pass.TrimEnd().PadRight(10)) +
						saps.PadRight(10);
				}

				// Получить хеш
				string hash = MD5.GenerateBase64HashFrom1251(stringToHash);
				return CryptUserHash(hash, userId);
			}


			/// <summary>
			/// Зашифровать хэш
			/// </summary>
			/// <param name="hash"></param>
			/// <param name="password"></param>
			/// <returns></returns>
			[EditorBrowsable(EditorBrowsableState.Never), Browsable(false)]
			public static string CryptUserHash(string hash, string password)
			{
				// Зашифровать хеш
				string cryptedPass = RC2.Encrypt(hash, password.ToUpper().PadRight(10));
				// Перевести в base64
				return Convert.ToBase64String(Encoding.GetEncoding(1251).GetBytes(cryptedPass));
			}
		}
	}
}
