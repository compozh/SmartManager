using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;

namespace Web.Data
{
	public abstract partial class SqlClient
	{
		/// <summary>
		/// Проверить наличие строки в БД
		/// </summary>
		public bool RecordExist(SqlCmd cmd)
		{
			SqlCmd command = CreateCommand();
			command.CommandText = String.Format("select case when exists ({0}) then 1 else 0 end", cmd.CommandText);
			List<DbParameter> param = new List<DbParameter>();
			foreach (DbParameter p in cmd.Parameters)
			{
				param.Add(CreateParameter(p.ParameterName, p.Value));
			}
			command.Parameters.AddRange(param.ToArray());
			return command.ExecScalar<int>() > 0;
		}

		public int GetNewMaxPK(string tableName, string pkField)
		{
			var cmd = CreateCommand();
			cmd.CommandText = String.Format("select max({1}) from {0}", tableName, pkField);
			return cmd.ExecScalar<int>() + 1;
		}

		/// <summary>
		/// Вызвать хранимую процедуру, которая возвращает большую строку.
		/// </summary>
		/// <param name="cmd">Команда вызова процедуры</param>
		/// <param name="outParameter">Выходной параметр - большая строка или varbinary</param>
		/// <returns>Значение выходного параметра</returns>
		public abstract object CallProcedureWithBigResult(SqlCmd cmd, DbParameter outParameter);

		public abstract Task<object> CallProcedureWithBigResultAsync(SqlCmd cmd, DbParameter outParameter);
	}
}