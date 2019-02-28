using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Text;
using System.Security.Cryptography;

namespace Web.Tools
{
	partial class Crypt
	{
		/// <summary>
		/// Хэш MD5
		/// </summary>
		public static class MD5
		{
			/// <summary>
			/// Получить хэш в виде строки base64 из строки в кодировке win-1251
			/// </summary>
			/// <param name="s">Входная строка</param>
			/// <returns>Хэш в виде строки base64</returns>
			public static string GenerateBase64HashFrom1251(string s)
			{
				var dataToHash = Text.Win1251Encoding.GetBytes(s);
				var checkSum = getHash(dataToHash);
				return Convert.ToBase64String(checkSum); 
			}

			/// <summary>
			/// Получить хэш
			/// </summary>
			/// <param name="s">Входная строка</param>
			/// <returns>Хеш в виде hex-строки</returns>
			/// <remarks>Для конвертации строки в байты используется кодировка Win-1251</remarks>
			public static string GenerateHash(string s)
			{
				return GenerateHash(Text.Win1251Encoding.GetBytes(s));
			}

			/// <summary>
			/// Получить хэш по строке, используя кодировку UTF-8
			/// </summary>
			/// <param name="s">Входная строка</param>
			/// <returns>Хеш в виде hex-строки</returns>
			/// <remarks>Для конвертации строки в байты используется кодировка UTF-8</remarks>
			public static string GenerateHashFromUtf8(string s)
			{
				return GenerateHash(Encoding.UTF8.GetBytes(s));
			}

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

//			/// <summary>
//			/// Получить хэш в виде компактной строки
//			/// </summary>
//			/// <param name="s"></param>
//			/// <returns></returns>
//			public static string GenerateCompactHash(string s)
//			{
//				var checkSum = getHash(Encoding.UTF8.GetBytes(s));
//				long firstInt = BitConverter.ToInt64(checkSum, 0);
//				long secontInt = BitConverter.ToInt64(checkSum, 8);
//				return Configuration.Settings.IntToCompactString(firstInt).ToLower() + Configuration.Settings.IntToCompactString(secontInt).ToLower();
//			}

			/// <summary>
			/// Вычислить хеш по файлу. Вернуть результат в кодировке base64
			/// </summary>
			/// <param name="fileName">Полное имя файла</param>
			/// <returns>Хеш в кодировке base64</returns>
			public static string GetHashBase64FromFile(string fileName)
			{
				return Convert.ToBase64String(getHashFromFile(fileName));
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

			/// <summary>
			/// Вычислить хеш по файлу. Вернуть результат в hex-формате
			/// </summary>
			/// <param name="fileName">Полное имя файла</param>
			/// <returns>Хеш в hex-формате</returns>
			public static string GetHashFromFile(string fileName)
			{
				var checkSum = getHashFromFile(fileName);
				return convertBytesToHexString(checkSum);
			}

			/// <summary>
			/// Получить хеш из файлов в заданной папке
			/// </summary>
			/// <param name="path">Папка</param>
			/// <param name="searchPatterns">Маски файлов</param>
			/// <returns></returns>
			/// <exclude />
			[EditorBrowsable(EditorBrowsableState.Never)]
			[Browsable(false)]
			public static Dictionary<string, string> GetHashFromFiles(string path, string[] searchPatterns)
			{
				var files = new List<string>();
				foreach (var searchPattern in searchPatterns)
				{
					files.AddRange(Directory.GetFiles(path, searchPattern, SearchOption.TopDirectoryOnly));
				}

				var hashes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
				foreach (var filePath in files)
				{
					string fileName = Path.GetFileName(filePath);
					if (string.IsNullOrWhiteSpace(fileName))
					{
						continue;
					}
					string fileHash = GetHashFromFile(filePath);
					hashes.Add(fileName, fileHash);
				}
				return hashes;
			}


			private static byte[] getHash(byte[] data)
			{
				var hashProvider = new MD5CryptoServiceProvider();
				return hashProvider.ComputeHash(data);
			}

			private static byte[] getHashFromFile(string fileName)
			{
				byte[] checkSum;
				var md5 = new MD5CryptoServiceProvider();
				using (var file = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
				{
					checkSum = md5.ComputeHash(file);
				}
				return checkSum;
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

		/// <summary>
		/// Преобразовать хэш, полученный из сервера БД (Win-1251) в hex-формат
		/// </summary>
		/// <param name="win1251Hash"></param>
		/// <returns></returns>
		public static string Win1251HashStringToHex(string win1251Hash)
		{
			var bytes = Text.Win1251Encoding.GetBytes(win1251Hash);
			var sb = new StringBuilder();
			foreach (byte b in bytes)
			{
				sb.Append(b.ToString("x2"));
			}
			return sb.ToString();
		}
	}
}
