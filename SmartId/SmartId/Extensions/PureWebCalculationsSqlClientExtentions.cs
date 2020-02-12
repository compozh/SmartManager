using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Data;
using Web.Tools;

namespace SmartId.Extensions
{
	/// <summary>
	/// Подключение sql клиента для использования Web расчетов
	/// </summary>
	public static class PureWebCalculationsSqlClientExtentions
	{
		/// <summary>
		/// Добавить sql клиент для работы веб расчетов
		/// </summary>
		/// <param name="services"></param>
		/// <param name="connectionStringName"></param>
		public static void AddPureWebCalculationsSqlClientInstance(this IServiceCollection services, string connectionStringName = "Connection")
		{
			var provider = services.BuildServiceProvider();
			var configuration = provider.GetService<IConfiguration>();

			services.Configure<ConnectionStringSettingsCollection>(configuration.GetSection("ConnectionStrings"));
			services.AddSingleton<SqlClientFactory>();
			services.AddSingleton(prov => ((SqlClientFactory)prov.GetService(typeof(SqlClientFactory))).InitClient(connectionStringName));

		}
	}
}
