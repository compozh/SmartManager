using System;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Web.Data.Sql.SqlApi;

namespace Web.Data
{
	internal class OracleClient : SqlClient
	{
		public OracleClient(string connectionString)
			: base(connectionString)
		{
			getSchemaFromConnectionString();
			Api = new OracleApi();
		}

		private void getSchemaFromConnectionString()
		{
			var schemaIndex = ConnectionString.IndexOf("schema", StringComparison.InvariantCultureIgnoreCase);
			if (schemaIndex < 0)
			{
				return;
			}
			var startIndex = ConnectionString.IndexOf("=", schemaIndex, StringComparison.InvariantCultureIgnoreCase) + 1;
			if (startIndex > 0)
			{
				var endIndex = ConnectionString.IndexOf(";", schemaIndex, StringComparison.InvariantCultureIgnoreCase);
				if (endIndex < 0)
				{
					endIndex = ConnectionString.Length;
				}
				_scheme = ConnectionString.Substring(startIndex, endIndex - startIndex);
				ConnectionString = ConnectionString.Remove(schemaIndex, endIndex - schemaIndex);
			}
		}

		private string _scheme;

		public override DbType Type
		{
			get { return DbType.Oracle; }
		}

		public override DbConnection CreateConnection(int timeOut)
		{
			var connectionStr = ConnectionString;
			if (timeOut != 0)
			{
				connectionStr = string.Format("{0}; Connection Timeout = {1}", connectionStr, timeOut);
			}
			var connection = new OracleConnection(connectionStr);
			//setParams(connection);
			//setWorkstationInfo(connection);
			return connection;
		}

		private string getSchemeFromConnectionString()
		{
			var connBuilder = new OracleConnectionStringBuilder(ConnectionString);
			return connBuilder.UserID;
		}

		private void setParams(OracleConnection connection)
		{
			var cmd = new OracleCommand();
			var schema = getSchemeFromConnectionString();
			cmd.CommandText = string.Format("alter session set current_schema={0} global_names=false" +
				" nls_date_format='YYYYMMDD HH24:MI:SS' nls_numeric_characters='.,'", schema);
			cmd.Connection = connection;
			connection.Open();
			cmd.ExecuteNonQuery();
			connection.Close();
		}

		private void setWorkstationInfo(OracleConnection connection)
		{
			var cmd = new OracleCommand("DBMS_APPLICATION_INFO.SET_CLIENT_INFO", connection);
			cmd.Parameters.Add("wsid", getWorkstationInfo());
			cmd.CommandType = CommandType.StoredProcedure;
			connection.Open();
			cmd.ExecuteNonQuery();
			connection.Close();
		}

		public override DbCommand CreateCommand(string commandText)
		{
			return new OracleCommand(commandText, (OracleConnection)getConnection());
		}

		public override void PrepareCommand(DbCommand command)
		{
			command.CommandText = command.CommandText.Replace("@", ":");
			if (command.CommandType == CommandType.StoredProcedure && !string.IsNullOrEmpty(_scheme))
			{
				command.CommandText = string.Concat(_scheme, ".", command.CommandText.Trim());
			}
		}

		public override DbParameter CreateParameter(string parameterName, object value)
		{
			if (value is string)
			{
				var str = (string) value;
				if (str == string.Empty)
				{
					// Если значение параметра - пустая строка, оно должно восприниматься как пустая строка, а не null
					str = " ";
				}
				return new OracleParameter(parameterName, str.Length >= 4000 ? OracleDbType.NClob : OracleDbType.Char, str, ParameterDirection.Input);
			}
			return new OracleParameter(parameterName, value);
		}

		public override object CallProcedureWithBigResult(SqlCmd cmd, DbParameter outParameter)
		{
			return CallProcedureWithBigResultAsync(cmd, outParameter).GetAwaiter().GetResult();
		}

		public override async Task<object> CallProcedureWithBigResultAsync(SqlCmd cmd, DbParameter outParameter)
		{
			var oracleParam = (OracleParameter)outParameter;
			oracleParam.OracleDbType = OracleDbType.Clob;

			string value = string.Empty;

			await cmd.OpenConnectionAsync().ConfigureAwait(false);
			try
			{
				await cmd.ExecNonQueryAsync().ConfigureAwait(false);
				var oracleClob = outParameter.Value as OracleClob;
				if (oracleClob != null)
				{
					value = oracleClob.Value;
					oracleClob.Dispose(); // очистить память, иначе OutOfMemoryException
				}
			}
			finally
			{
				cmd.CloseConnection();
			}

			return value;
		}

		public override bool IsNull(DbParameter param)
		{
			var nullabel = param.Value as INullable;
			return base.IsNull(param) || (nullabel != null && nullabel.IsNull);
		}

		public override string GetFunctionFullName(string name)
		{
			return !string.IsNullOrEmpty(_scheme) ? string.Format("{0}.{1}", _scheme, name) : name;
		}
	}
}