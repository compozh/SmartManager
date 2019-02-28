using System;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Web.Data.Sql.SqlApi;

namespace Web.Data
{
	public class MsSqlClient : SqlClient
	{
		public MsSqlClient(string connectionString)
			: base(connectionString)
		{
			Api = new MsSqlApi();
		}

		public override SqlClient.DbType Type
		{
			get { return DbType.MsSql; }
		}

		public override DbConnection CreateConnection(int timeOut)
		{
			var connectionBuilder = new SqlConnectionStringBuilder(ConnectionString);
			if (timeOut != 0)
			{
				connectionBuilder.ConnectTimeout = timeOut;
			}
			connectionBuilder.Pooling = false;
			connectionBuilder.MultipleActiveResultSets = true;

			connectionBuilder.WorkstationID = getWorkstationInfo();
			return new SqlConnection(connectionBuilder.ConnectionString);
		}

		public override DbCommand CreateCommand(string commandText)
		{
			var conn = getConnection();
			var sqlConn = (SqlConnection)conn;
			var command = new SqlCommand(commandText, sqlConn) { CommandTimeout = conn.ConnectionTimeout };
			return command;
		}

		public override void PrepareCommand(DbCommand command)
		{
		}

		public override DbParameter CreateParameter(string parameterName, object value)
		{
			// Преобразовать DateTime.MinValue в null 
			if (value is DateTime)
			{
				var dt = (DateTime)value;
				if (dt == DateTime.MinValue)
				{
					value = DBNull.Value;
				}
			}
			else if (value == null)
			{
				value = DBNull.Value;
			}
			return new SqlParameter(parameterName, value);
		}

		public override object CallProcedureWithBigResult(SqlCmd cmd, DbParameter outParameter)
		{
			cmd.OpenConnection();
			try
			{
				cmd.ExecNonQuery();
			}
			finally
			{
				cmd.CloseConnection();
			}
			return outParameter.Value;
		}

		public override async Task<object> CallProcedureWithBigResultAsync(SqlCmd cmd, DbParameter outPar)
		{
			await cmd.OpenConnectionAsync().ConfigureAwait(false);
			try
			{
				await cmd.ExecNonQueryAsync().ConfigureAwait(false);
			}
			finally
			{
				cmd.CloseConnection();
			}

			return outPar.Value;
		}

		public override string GetFunctionFullName(string name)
		{
			return string.Concat("dbo.", name);
		}
	}
}