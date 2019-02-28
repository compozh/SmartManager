using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading;
using Web.Data.Sql.SqlApi;

namespace Web.Data
{
	/// <summary>
	/// Класс работы с сервером БД
	/// </summary>
	public abstract partial class SqlClient
	{
		private int _connectionTimeOut = 300;

		/// <summary>
		/// Строка подключения к БД
		/// </summary>
		protected string ConnectionString { get; set; }

		/// <summary>
		/// Тайм-аут выполнения команды
		/// </summary>
		public int ConnectionTimeOut
		{
			get { return _connectionTimeOut; }
			set { _connectionTimeOut = value; }
		}
		
		/// <summary>
		/// API для вызова функций
		/// </summary>
		public SqlApi Api { get; protected set; }
		
		/// <summary>
		/// ctor
		/// </summary>
		/// <param name="connectionString">Строка подключения к БД</param>
		protected SqlClient(string connectionString)
		{
			ConnectionString = connectionString;
		}

		/// <summary>
		/// Тип БД
		/// </summary>
		public abstract DbType Type { get; }

		/// <summary>
		/// Создать подключение
		/// </summary>
		/// <param name="timeOut">Тайм-аут соединения</param>
		/// <returns></returns>
		public abstract DbConnection CreateConnection(int timeOut);

		/// <summary>
		/// Получить соединение
		/// </summary>
		/// <returns></returns>
		protected DbConnection getConnection()
		{
			var connection = CreateConnection(ConnectionTimeOut);
			return connection;
		}

		/// <summary>
		/// Получить информацию об локальной машине
		/// </summary>
		/// <returns></returns>
		protected string getWorkstationInfo()
		{
			return string.Format("{0}...{1}", Environment.MachineName,
				Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName.ToUpper());
		}

		/// <summary>
		/// Создать команду
		/// </summary>
		/// <param name="commandText"></param>
		/// <returns></returns>
		public abstract DbCommand CreateCommand(string commandText);

		public abstract string GetFunctionFullName(string name);
		
		/// <summary>
		/// Создать SQL команду
		/// </summary>
		/// <returns></returns>
		public SqlCmd CreateCommand()
		{
			var cmd = CreateCommand(string.Empty);
			return new SqlCmd(cmd, this);
		}

		/// <summary>
		/// Текущая дата-время на SQL-сервере 
		/// </summary>
		public DateTime DateTimeSql
		{
			get
			{
//				if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["USELOCALTIME"]))
//				{
//					var dt = DateTime.Now;
//					return dt.AddMilliseconds(-dt.Millisecond);
//				}
				var command = CreateCommand();
				command.CommandText = string.Format("select {0} {1}", Api.DateTimeSql(), Api.EmptyFrom());
				var dateTime = command.ExecScalar<DateTime>();
				return dateTime;
			}
		}

		/// <summary>
		/// Завершено инициализацию клиента
		/// </summary>
		public static event Action InitComplete;

//		/// <summary>
//		/// Инициализировать клиент SQL
//		/// </summary>
//		public static void Init()
//		{
//			Init("Connection");
//		}

//		/// <summary>
//		/// Инициализировать клиент SQL по заданному ID SQL-соединения
//		/// </summary>
//		/// <param name="connectionId"></param>
//		public static void Init(string connectionId)
//		{
//			var connSettings = ConfigurationManager.ConnectionStrings[connectionId];
//			Init(connSettings.ConnectionString, !connSettings.ProviderName.Equals("Oracle.DataAccess.Client"));
//		}

	
		/// <summary>
		/// Инициализировать клиент SQL по заданной строке соединения
		/// </summary>
		/// <param name="connectionString"></param>
		/// <param name="msSql"></param>
		public static SqlClient Init(string connectionString, bool msSql)
		{
			var instance = !msSql ? createOracleClient(connectionString) : createMsSqlClient(connectionString);
			if (InitComplete != null)
			{
				InitComplete();
			}

			return instance;
		}

		private static SqlClient createOracleClient(string connectionString)
		{
			return new OracleClient(connectionString);
		}

		private static SqlClient createMsSqlClient(string connectionString)
		{
			return new MsSqlClient(connectionString);
		}

		public abstract void PrepareCommand(DbCommand command);

		public virtual bool IsNull(DbParameter param)
		{
			var value = param.Value;
			return value == null || value is DBNull;
		}

		public enum DbType
		{
			MsSql,
			Oracle
		}

		public abstract DbParameter CreateParameter(string parameterName, object value);
		
		public enum DbParameterType
		{
			Char,
			Int
		}

		public static List<int> GetSqlException(Exception ex)
		{
			var sqlException = ex as SqlException;
			List<int> er = new List<int>();
			if (sqlException != null)
			{
				for (int i = 0; i < sqlException.Errors.Count; i++)
				{
					er.Add(sqlException.Errors[i].Number);
				}
			}
			return er;
		}
	}
}