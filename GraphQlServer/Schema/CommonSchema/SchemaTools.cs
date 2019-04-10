using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using Web.Data;
namespace SkdScheme.CommonSchema
{
	public class SchemaTools
	{
		private readonly SqlClient _client;

		public SchemaTools(SqlClient client)
		{
			_client = client;
		}

		/// <summary>
		/// Подробное описание схемы
		/// </summary>
		/// <param name="name">Имя схемы в базе</param>
		/// <returns></returns>
		public SchemaDescription GetSchemaDescription(string name)
		{
			SchemaDescription shcema;
			int headerIndex = 0;
			int schemaNameIndex = 1;
			int anonymusIndex = 2;
			var command = _client.CreateCommand("select GQSCHEMA.ID, GQSCHEMA.NAME, GQSCHEMA.ALLOWANON from GQSCHEMA where GQSCHEMA.ID = @gqshemid");
			command.Parameters.Add(new SqlParameter("@gqshemid", name));
			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				reader.Read();
				shcema = new SchemaDescription
				{
					Id = reader.GetString(headerIndex).Trim(),
					Name = reader.GetString(schemaNameIndex).Trim(),
					Types = new List<SchemaType>()
				};
			}

			var typeIndex = 0;
			var nameIndex = 1;
			var dbIndex = 2;
			var krepIndex = 3;
			anonymusIndex = 4;
			var conditionIndex = 5;

			command = _client.CreateCommand(@"select GQTYPE.ID, GQTYPE.NAME, GQTYPE.DB, GQTYPE.KREP, GQTYPE.ALLOWANON, GQTYINSC.CONDITION from GQTYPE join GQTYINSC on GQTYINSC.IDTYPE = GQTYPE.ID and GQTYINSC.IDSCHEMA = @schemaid");
			command.Parameters.Add(new SqlParameter("@schemaid", shcema.Id));
			command.Connection.Open();
			using (var reader = command.ExecuteReader())
			{
				if (reader.HasRows)
				{
					while (reader.Read())
					{
						shcema.Types.Add(new SchemaType
						{
							Id = reader.GetString(typeIndex).Trim(),
							Name = reader.GetString(nameIndex).Trim(),
							TableName=reader.GetString(dbIndex).Trim(),
							BrowseId = reader.GetString(krepIndex).Trim(),
							AllowAnonymosly = reader.IsDBNull(anonymusIndex) ? null :  reader.GetString(anonymusIndex).Trim(),
							Condition = reader.IsDBNull(conditionIndex) ? null : reader.GetString(conditionIndex),
							Columns = new List<SchemaColumn>()
						});
					}
				}
			}
			command.Connection.Close();

			var expressionIndex = 0;
			var descriptionIndex = 1;
			var columnNameIndex = 2;
			var fieldTypeIndex = 3;
			for (int i = 0; i < shcema.Types.Count; i++)
			{
				command = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM, REPS.TYPE from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
				command.Parameters.Add(new SqlParameter("@repskrep", shcema.Types[i].BrowseId));
				command.Parameters.Add(new SqlParameter("@repsdb", shcema.Types[i].TableName));
				command.Connection.Open();
				using (var reader = command.ExecuteReader())
				{
					if (reader.HasRows)
					{
						while (reader.Read())
						{
							var tempColumn = new SchemaColumn {
								Expression = reader.IsDBNull(expressionIndex) ? null : reader.GetString(expressionIndex).Trim(),
								Description = reader.IsDBNull(nameIndex) ? null : reader.GetString(nameIndex).Trim(),
								Name = reader.GetString(columnNameIndex).Trim(),
								Type = reader.IsDBNull(fieldTypeIndex) ? 0 : convertToEnym(reader.GetString(fieldTypeIndex).Trim()),
							};
							if (string.IsNullOrEmpty(tempColumn.Name))
							{
								tempColumn.Name = getNewColumnName(shcema.Types[i]);
							}
							shcema.Types[i].Columns.Add(tempColumn);
						}
					}
				}
				command.Connection.Close();
			}
			return shcema;
		}

		/// <summary>
		/// Метод для получения данных для типа
		/// </summary>
		/// <param name="type"> тип</param>
		/// <param name="columns"> Поля, которыe запрашиваем </param>
		/// <returns></returns>
		public List<Dictionary<string, object>> GetDataForType(SchemaType type, List<string> columns)
		{
			var schemaColumns = new List<SchemaColumn>();

			foreach (var name in columns)
			{
				 foreach (var el in type.Columns)
				{
					if (String.Equals(el.Name, name, StringComparison.InvariantCultureIgnoreCase))
					{
						schemaColumns.Add(el);
					}
				}
			}
			//Select к базе
			string selectQuery = string.Join(", ", schemaColumns.Select(e=>e.Expression));

			var resultData = new List<Dictionary<string, object>>();

				string condition = "";
				if (!string.IsNullOrEmpty(type.Condition))
				{
					condition = String.Format("where {0}", type.Condition);
				}

				var command = _client.CreateCommand(String.Format("select {0} from {1} {2}", selectQuery, type.TableName, condition));

				command.Connection.Open();

				using (var reader = command.ExecuteReader())
				{
					if (!reader.HasRows)
					{
						return null;
					}
					while (reader.Read())
					{
						Dictionary<string, object> dictionary = new Dictionary<string, object>();
						dictionary.Clear();
						for (int i = 0; i < schemaColumns.Count; i++)
						{
							dictionary.Add(columns[i], getValueColumnType(reader, schemaColumns[i], i));
						}
						resultData.Add(dictionary);
					}
				}
				command.Connection.Close();

			return resultData;
		}
		/// <summary>
		/// Метод, который возвращает новое уникальное имя для колонки
		/// </summary>
		/// <param name="type">Тип, от него нам нужны только колонки</param>
		/// <returns>Уникальное имя для колонки</returns>
		private string getNewColumnName(SchemaType type)
		{
			var tempColumnNumber = 0;
			while (tempColumnNumber < 99999)
			{
				tempColumnNumber++;
				var columnName = "cell" + tempColumnNumber;

				var isNewName = type.Columns.All(c => !string.Equals(c.Name, columnName, StringComparison.InvariantCultureIgnoreCase));

				if (isNewName)
				{
					return columnName;
				}
			}
			return null;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="column"> Это reader </param>
		/// <param name="type"> Это тип поля</param>
		/// <param name="columnNumber">Это номер колонки, чтобы считать </param>
		/// <returns></returns>
		private object getValueColumnType(DbDataReader reader, SchemaColumn column, int columnNumber)
		{
			switch (column.Type)
			{
				case SlvColumnType.Char:
					return reader.GetString(columnNumber);
					break;
				case SlvColumnType.Date:
					return reader.GetDateTime(columnNumber);
					break;
				case SlvColumnType.DateTime:
					return reader.GetDateTime(columnNumber);
					break;
				case SlvColumnType.Guid:
					return reader.GetGuid(columnNumber);
					break;
				case SlvColumnType.Memo:
					return reader.GetString(columnNumber);
					break;
				case SlvColumnType.Numeric:
					return reader.GetInt16(columnNumber);
					break;
				default:
					return reader.GetString(columnNumber);
					break;
			}
		}
		/// <summary>
		/// Разбираем, то, что приходит с сервера и преобразоваем в enum
		/// </summary>
		/// <param name="fieldType"></param>
		/// <returns></returns>
		private SlvColumnType convertToEnym(string fieldType)
		{
			switch (fieldType)
			{
				case "C":
					return SlvColumnType.Char;
					break;
				case "N":
					return SlvColumnType.Numeric;
					break;
				case "D":
					return SlvColumnType.Date;
					break;
				case "T":
					return SlvColumnType.DateTime;
					break;
				case "M":
					return SlvColumnType.Memo;
					break;
				case "G":
					return SlvColumnType.Guid;
					break;
				default:
					return SlvColumnType.ANY;
					break;
			}
		}
	}
}
