using System;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace Web.Tools
{
	/// <summary>
	/// Шифрование
	/// </summary>
	public static partial class Crypt
	{
		# region Шифрование
		/// <summary>
		/// Симметрическое шифрование заданых данных
		/// </summary>
		/// <param name="data">Данные для шифрования</param>
		/// <param name="key">Ключ шифрования</param>
		/// <returns>Зашифрованные данные</returns>
		public static byte[] EncryptByteArray(byte[] data, string key)
		{
			SymmetricAlgorithm sa = Rijndael.Create();
			ICryptoTransform ct = sa.CreateEncryptor(
				(new PasswordDeriveBytes(key, null)).GetBytes(16),
				new byte[16]);

			MemoryStream ms = new MemoryStream();
			CryptoStream cs = new CryptoStream(ms, ct, CryptoStreamMode.Write);

			cs.Write(data, 0, data.Length);
			cs.FlushFinalBlock();

			return ms.ToArray();
		}

		/// <summary>
		/// Симметрическое шифрование заданной строки
		/// </summary>
		/// <param name="data">Строка для шифрования</param>
		/// <param name="key">Ключ шифрования</param>
		/// <returns>Зашифрованная строка</returns>
		public static string Encrypt(string data, string key)
		{
			return Convert.ToBase64String(EncryptByteArray(Encoding.UTF8.GetBytes(data), key));
		}
		# endregion

		# region Дешифрация
		/// <summary>
		/// Дешифрование заданых данных
		/// </summary>
		/// <param name="data">Зашифрованные данные</param>
		/// <param name="key">Ключ шифрования</param>
		/// <returns>Расшифрованные данные</returns>
		public static byte[] DecryptByteArray(byte[] data, string key)
		{
			var cs = internalDecrypt(data, key);
			var br = new BinaryReader(cs);
			var ms = new MemoryStream();
			const int bufferSize = 4096;
			var buffer = new byte[bufferSize];
			var readCount = br.Read(buffer, 0, bufferSize);
			while (readCount > 0)
			{
				ms.Write(buffer, 0, readCount);
				readCount = br.Read(buffer, 0, bufferSize);
			}
			return ms.ToArray();
		}

		/// <summary>
		/// Дешифрование заданной строки
		/// </summary>
		/// <param name="data">Зашифрованная строка</param>
		/// <param name="key">Ключ шифрования</param>
		/// <returns>Расшифрованная строка</returns>
		public static string Decrypt(string data, string key)
		{
			CryptoStream cs = internalDecrypt(Convert.FromBase64String(data), key);
			StreamReader sr = new StreamReader(cs);
			return sr.ReadToEnd();
		}
		# endregion

		private static CryptoStream internalDecrypt(byte[] data, string key)
		{
			SymmetricAlgorithm sa = Rijndael.Create();
			ICryptoTransform ct = sa.CreateDecryptor(
				(new PasswordDeriveBytes(key, null)).GetBytes(16),
				new byte[16]);

			MemoryStream ms = new MemoryStream(data);
			return new CryptoStream(ms, ct, CryptoStreamMode.Read);
		}
	}
}
