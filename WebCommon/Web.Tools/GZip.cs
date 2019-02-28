using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.IO.Compression;

namespace Web.Tools.Compression
{
	/// <summary>
	/// Сжатие методом Gzip
	/// </summary>
	public class GZip
	{
		private readonly string _zippedPath = string.Empty;
		private readonly string _folderPath = string.Empty;

		/// <summary>
		/// Пароль к архиву
		/// </summary>
		public string Password { get; set; }

		/// <summary>
		/// Указание архиватору, что происходит архивация файла, а не папки
		/// </summary>
		public bool SourcePathIsFile { get; set; }

		/// <summary>
		/// Приоритет операций при работе с Zip
		/// </summary>
		public System.Threading.ThreadPriority Priority { get; set; }

		/// <summary>
		/// Создать объект для работы с ZIP архивированием/деархивированием папки
		/// </summary>
		/// <param name="zippedPath">Путь к архиву</param>
		/// <param name="folderPath">Путь к папке</param>
		public GZip(string zippedPath, string folderPath)
		{
			_zippedPath = zippedPath ?? string.Empty;
			_folderPath = folderPath ?? string.Empty;
			Priority = System.Threading.ThreadPriority.Normal;
		}


		#region Архивирование/деархивирование файла через GZipStream

		/// <summary>Компрессия файла</summary>
		/// <param name="fileIn">Исходный файл</param>
		/// <param name="fileOut">Файл-архив</param>
		[Obsolete]
		public static void Compress(string fileIn, string fileOut)
		{
			FileStream input = new FileStream(fileIn, FileMode.Open, FileAccess.Read, FileShare.Read);
			FileStream output = new FileStream(fileOut, FileMode.Create, FileAccess.Write, FileShare.None);
			Compress(input, output);
			output.Close();
			input.Close();
		}

		/// <summary>Декомпрессия файла</summary>
		/// <param name="fileIn">Файл-архив</param>
		/// <param name="fileOut">Результат</param>
		[Obsolete]
		public static void Decompress(string fileIn, string fileOut)
		{
			FileStream input = new FileStream(fileIn, FileMode.Open, FileAccess.Read, FileShare.Read);
			FileStream output = new FileStream(fileOut, FileMode.Create, FileAccess.Write, FileShare.None);
			Decompress(input, output);
			output.Close();
			input.Close();
		}

		/// <summary>Компрессия</summary>
		/// <param name="source">Входящий поток</param>
		/// <param name="destination">Исходящий поток</param>
		public static void Compress(Stream source, Stream destination)
		{
			using (GZipStream output = new GZipStream(destination, CompressionMode.Compress))
			{
				copyStream(source, output);
			}
		}

		/// <summary>Декомпрессия потока</summary>
		/// <param name="source">Архивный поток</param>
		/// <param name="destination">Результат</param>
		public static void Decompress(Stream source, Stream destination)
		{
			using (GZipStream output = new GZipStream(source, CompressionMode.Decompress))
			{
				copyStream(output, destination);
			}
		}

		private static void copyStream(Stream input, Stream output)
		{
			byte[] bytes = new byte[65536];
			int i;
			while ((i = input.Read(bytes, 0, bytes.Length)) != 0)
			{
				output.Write(bytes, 0, i);
			}
		}

		#endregion
	}
}