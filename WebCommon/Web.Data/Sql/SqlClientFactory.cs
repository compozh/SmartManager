using System;
using System.Reflection.Metadata.Ecma335;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;


using Web.Tools;


namespace Web.Data
{
	public class SqlClientFactory
	{
		private ConnectionStringSettingsCollection _connectionStrings;


		public SqlClientFactory(IOptionsMonitor<ConnectionStringSettingsCollection> connectionStringsOptions)
		{
			_connectionStrings = connectionStringsOptions.CurrentValue;
		}

		public SqlClient InitClient(string connectionId = "Connection")
		{
			var cs = _connectionStrings[connectionId];
			return SqlClient.Init(cs.ConnectionString, !cs.ProviderName.Equals("Oracle.DataAccess.Client"));
		}


		
	}

	public static class SqlClientFactoryExtentions
	{
		public static void AddSqlClientInstance(this IServiceCollection services, IConfiguration config)
		{
			services.Configure<ConnectionStringSettingsCollection>(config.GetSection("ConnectionStrings"));
			services.AddSingleton<SqlClientFactory>();
			services.AddSingleton(provider => ((SqlClientFactory)provider.GetService(typeof(SqlClientFactory))).InitClient());

		}		
	}
	
	
}