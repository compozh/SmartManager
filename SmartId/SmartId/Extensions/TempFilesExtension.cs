using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Extensions
{
	public class TempFiles
	{
		/// <summary>
		/// Получить полный путь к новому временному файлу
		/// </summary>
		/// <returns></returns>
		public string GetTempFilePath()
		{
			// TODO: брать временную папку из настроек
			return Path.Combine(Path.GetTempPath(), Path.GetTempFileName());
		}
	}

	public static class TempFilesExtentions
	{
		public static IServiceCollection AddTempFiles(this IServiceCollection services)
		{
			services.AddSingleton<TempFiles>();
			return services;
		}
	}
}
