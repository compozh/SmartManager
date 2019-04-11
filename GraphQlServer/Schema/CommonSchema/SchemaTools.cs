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
			var decIndex = 4;
			for (var i = 0; i < shcema.Types.Count; i++)
			{
				command = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM, REPS.TYPE, REPS.DEC from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
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
								Description = reader.IsDBNull(descriptionIndex) ? null : reader.GetString(descriptionIndex).Trim(),
								Name = reader.GetString(columnNameIndex).Trim(),
								Type = reader.IsDBNull(fieldTypeIndex) ? 0 : convertToEnum(reader.GetString(fieldTypeIndex).Trim(), reader.GetInt16(decIndex)),
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
			var selectQuery = string.Join(", ", schemaColumns.Select(e=> $"{e.Expression} as {e.Name}"));

			var resultData = new List<Dictionary<string, object>>();

			var condition = "";
			if (!string.IsNullOrEmpty(type.Condition))
			{
				condition = $"where {type.Condition}";
			}
			var command = _client.CreateCommand($"select {selectQuery} from {type.TableName} {condition}");

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
					for (var i = 0; i < schemaColumns.Count; i++)
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
		/// Определение типа колонки 
		/// </summary>
		/// <param name="reader">  reader </param>
		/// <param name="column">  тип поля</param>
		/// <param name="columnNumber"> номер колонки, чтобы считать </param>
		/// <returns></returns>
		private object getValueColumnType(DbDataReader reader, SchemaColumn column, int columnNumber)
		{
			switch (column.Type)
			{
				case SlvColumnType.Char:
					return reader.IsDBNull(columnNumber) ? null : reader.GetString(columnNumber);
				case SlvColumnType.Date:
					return reader.IsDBNull(columnNumber) ? null : (DateTime?)reader.GetDateTime(columnNumber);
				case SlvColumnType.DateTime:
					return reader.IsDBNull(columnNumber) ? null : (DateTime?)reader.GetDateTime(columnNumber);
				case SlvColumnType.Guid:
					return reader.IsDBNull(columnNumber) ? null : (Guid?)reader.GetGuid(columnNumber);
				case SlvColumnType.Memo:
					return reader.IsDBNull(columnNumber) ? null : reader.GetString(columnNumber);
				case SlvColumnType.Numeric:
					return reader.IsDBNull(columnNumber) ? null :  (Int16?)reader.GetInt16(columnNumber);
				case SlvColumnType.Decimal:
					return reader.IsDBNull(columnNumber) ? null : (Decimal?)reader.GetDecimal(columnNumber);
				default:
					return reader.IsDBNull(columnNumber) ? null : reader.GetString(columnNumber);
			}
		}

		/// <summary>
		/// Определение типа колонки по коду типа, преобразование типа колонки в enum
		/// </summary>
		/// <param name="fieldType"></param>
		/// <returns></returns>
		private SlvColumnType convertToEnum(string fieldType, Int16 dec)
		{
			switch (fieldType)
			{
				case "C":
					return SlvColumnType.Char;
				case "N":
					if (dec.Equals(0))
					{
						return SlvColumnType.Numeric;
					}
					return SlvColumnType.Decimal;
				case "D":
					return SlvColumnType.Date;
				case "T":
					return SlvColumnType.DateTime;
				case "M":
					return SlvColumnType.Memo;
				case "G":
					return SlvColumnType.Guid;
				default:
					return SlvColumnType.Other;
			}
		}
	}
}
