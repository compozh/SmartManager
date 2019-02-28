using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Reflection;
using System.Text;
using Web.Tools;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Data
{
	public class SqlCmd
	{
		public string CommandText
		{
			get { return Command.CommandText; }
			set { Command.CommandText = value; }
		}

		/// <summary>
		/// Тип запроса
		/// </summary>
		public CommandType CommandType
		{
			get { return Command.CommandType; }
			set { Command.CommandType = value; }
		}

		public DbParameterCollection Parameters
		{
			get { return Command.Parameters; }
		}

		public CommandBehavior CommandBehavior { get; set; }

		protected internal DbCommand Command;

		/// <summary>
		/// Создать экземпляр класса
		/// </summary>
		/// <param name="cmd">Экземпляр класса <see cref="SqlCommand"/></param>
		public SqlCmd(DbCommand cmd, SqlClient instance)
		{
			_instance = instance;
			Command = cmd;
			CommandBehavior = CommandBehavior.Default;
		}
		

		/// <summary>
		/// Тайм-аут выполнения команды
		/// </summary>
		public int Timeout
		{
			get { return Command.CommandTimeout; }
			set { Command.CommandTimeout = value; }
		}

		/// <summary>
		/// Открыть соединение с БД
		/// </summary>
		internal void OpenConnection()
		{
			if (Command.Transaction != null || Command.Connection.State == ConnectionState.Open)
			{
				return;
			}
			Command.Connection.Open();
		}

		/// <summary>
		/// Закрыть соединение с БД
		/// </summary>
		internal void CloseConnection()
		{
			if (Command.Transaction == null && Command.Connection.State == ConnectionState.Open)
			{
				Command.Connection.Close();
			}
		}

		/// <summary>
		/// Выполнить запрос и вернуть 
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <returns></returns>
		public T ExecScalar<T>()
		{
			OpenConnection();
			_instance.PrepareCommand(Command);
			T res;
			try
			{
				res = exec<T>();
			}
			finally
			{
				CloseConnection();
			}
			return res;
		}

		public int ExecNonQuery()
		{
			
			OpenConnection();
			int res;
			try
			{
				res = ExecNonQueryEx();
			}
			finally
			{
				CloseConnection();
			}
			return res;
		}

		internal int ExecNonQueryEx()
		{
			_instance.PrepareCommand(Command);
			var ret = Command.ExecuteNonQuery();
			Command.Dispose();
			return ret;
		}

		private T exec<T>()
		{
			if (typeof (T) == typeof (DbDataReader))
			{
				return WebTools.ConvertResult<T>(Command.ExecuteReader(CommandBehavior.CloseConnection));
			}
			return WebTools.ConvertResult<T>(Command.ExecuteScalar());
		}

		public void AddArrayParameters<T>(string paramName, List<T> values)
		{
			var array = values.ToArray();
			var parameters = new string[array.Length];
			for (var i = 0; i < array.Length; i++)
			{
				parameters[i] = string.Format("@arr_{0}{1}", paramName, i);
				Parameters.Add(_instance.CreateParameter(parameters[i], array[i]));
			}
			CommandText = CommandText.Replace("@" + paramName, string.Join(", ", parameters));
		}

		private bool hasWhereCondition()
		{
			if (CommandText.ToLower().Contains(_whereClause))
			{
				return true;
			}
			return false;
		}

		private const string _whereClause = " where ";

		/// <summary>
		/// Добавить условие отбора
		/// </summary>
		/// <param name="where">Условие отбора</param>
		/// <remarks>Если условие отбора уже есть в команде, то новое условие добавляется через логическое "ИЛИ"</remarks>
		public void AttachWhereCondition(SqlCmd where)
		{
			bool hasWhere = hasWhereCondition();
			Command.CommandText = string.Format(!hasWhere ? "{0} where {1}" : "{0}) and ({1})",
				CommandText, @where.CommandText);
			if (hasWhere)
			{
				Command.CommandText = Command.CommandText.Insert(Command.CommandText.IndexOf(_whereClause)
					+ _whereClause.Length, "(");
			}
			var paramList = Parameters.Cast<DbParameter>().ToList();
			// Проверить нет ли параметров с одинаковыми именами и переименовать, если есть
			foreach (DbParameter parameter in where.Parameters)
			{
				if (paramList.Exists(p =>
					p.ParameterName.Equals(parameter.ParameterName, StringComparison.OrdinalIgnoreCase)))
				{
					var newName = randomParameterName();
					where.CommandText = where.CommandText.Replace(String.Concat("@", parameter.ParameterName),
						String.Concat("@", newName));
					where.Parameters[parameter.ParameterName].ParameterName = newName;
				}
			}
			var parameters = new DbParameter[where.Parameters.Count];
			where.Parameters.CopyTo(parameters, 0);
			foreach (DbParameter sqlParameter in where.Parameters)
			{
				Command.Parameters.Add(_instance.CreateParameter(sqlParameter.ParameterName, sqlParameter.Value));
			}
		}

		private static readonly Random _random = new Random((int)DateTime.Now.Ticks);
		private SqlClient _instance;

		private string randomParameterName()
		{
			var builder = new StringBuilder();
			for (int i = 0; i < 10; i++)
			{
				char ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * _random.NextDouble() + 65)));
				builder.Append(ch);
			}
			return builder.ToString();
		}

		public long GetNewMaxPK(string tableName, string pkField)
		{
			var cmd = _instance.CreateCommand();
			cmd.CommandText = String.Format("select max({1}) from {0}", tableName, pkField);
			return cmd.ExecScalar<long>() + 1;
		}

		public List<T> ExecObjects<T>() where T : new()
		{
			var type = typeof(T);
			var mapping = getMappings(type);
			var result = new List<T>();

			using (var rdr = ExecReader())
			{
				while (rdr.Read())
				{
					var obj = new T();
					for (int i = 0; i < rdr.FieldCount; i++)
					{
						var fieldName = rdr.GetName(i);
						if (mapping.ContainsKey(fieldName))
						{
							Type propertyType = mapping[fieldName].PropertyType;
							Type nullableType = Nullable.GetUnderlyingType(propertyType);

							object value = Convert.ChangeType(rdr[i], nullableType ?? propertyType);
							if (value is string)
							{
								value = (value as string).TrimEnd();
							}
							mapping[fieldName].SetValue(obj, value, null);

						}
					}
					result.Add(obj);
				}
			}
			return result;
		}

		private Dictionary<string, PropertyInfo> getMappings(Type type)
		{
			var mappings = new Dictionary<string, PropertyInfo>(StringComparer.OrdinalIgnoreCase);
			var properties = type.GetProperties();
			foreach (var prop in properties)
			{
				var attr = prop.GetCustomAttributes(typeof(MapFieldAttribute), false).ToList();
				if (attr.Count > 0)
				{
					var mapAttr = (MapFieldAttribute)attr[0];
					mappings.Add(mapAttr.Field, prop);
				}
			}
			return mappings;
		}

		/// <summary>
		/// Создать <see cref="DataReader"/> по отобранным коммандой данным
		/// </summary>
		/// <returns>Объект класса <see cref="DataReader"/></returns>
		public DataReader ExecReader()
		{
			OpenConnection();
			_instance.PrepareCommand(Command);
			return new DataReader(Command.ExecuteReader(CommandBehavior | CommandBehavior.CloseConnection), this);
		}

		public async Task OpenConnectionAsync()
		{
			if (Command.Transaction != null || Command.Connection.State == ConnectionState.Open)
			{
				return;
			}
			await Command.Connection.OpenAsync().ConfigureAwait(false);
		}

		public async Task ExecNonQueryAsync()
		{
			await Command.ExecuteNonQueryAsync().ConfigureAwait(false);
		}
	}
}