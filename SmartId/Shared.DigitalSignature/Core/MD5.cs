using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Shared.DigitalSignature.Core
{
	/// <summary>
	/// Хэш MD5
	/// </summary>
	public static class MD5
	{
		/// <summary>
		/// Получить хэш
		/// </summary>
		/// <param name="bytes">Входный данные</param>
		/// <returns>Хеш в виде hex-строки</returns>
		public static string GenerateHash(byte[] bytes)
		{
			var checkSum = getHash(bytes);
			return convertBytesToHexString(checkSum);
		}

		/// <summary>
		/// Вычислить хеш по строке. Вернуть результат в кодировке base64
		/// </summary>
		/// <param name="data">Полное имя файла</param>
		/// <returns>Хеш в кодировке base64</returns>
		public static string GetHashBase64(string data)
		{
			var checkSum = getHash(Encoding.UTF8.GetBytes(data));
			return Convert.ToBase64String(checkSum);
		}

		private static byte[] getHash(byte[] data)
		{
			var hashProvider = new MD5CryptoServiceProvider();
			return hashProvider.ComputeHash(data);
		}

		private static string convertBytesToHexString(byte[] bytes)
		{
			var sb = new StringBuilder();
			for (int i = 0; i < bytes.Length; i++)
			{
				sb.Append(bytes[i].ToString("x2"));
			}
			return sb.ToString();
		}
	}
}
