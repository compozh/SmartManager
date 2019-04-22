using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Web.Data;
using Web.WebRequests;

namespace SkdSchema.CommonSchema
{
	public class SchemaTools
	{
		private readonly SqlClient _client;
		private readonly WebRequestsTools _webRequest;
		 
		public SchemaTools(SqlClient client, WebRequestsTools webRequest)
		{
			_client = client;
			_webRequest = webRequest;
		}

		/// <summary>
		/// Подробное описание схемы
		/// </summary>
		/// <param name="name">Имя схемы в базе</param>
		/// <returns></returns>
		public SchemaDescription GetSchemaDescription(string name, bool anonymousСall)
		{
			SchemaDescription schema;
			var headerIndex = 0;
			var schemaNameIndex = 1;
			var anonymusIndex = 2;

			var anonymSchemaCall = "where GQSCHEMA.ID = @gqshemid ";
			if (anonymousСall)
			{
				anonymSchemaCall += "AND GQSCHEMA.ALLOWANON = '+'";
			}
			var command = _client.CreateCommand($"select GQSCHEMA.ID, GQSCHEMA.NAME, GQSCHEMA.ALLOWANON from GQSCHEMA {anonymSchemaCall}");
			command.Parameters.Add(new SqlParameter("@gqshemid", name));
			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				reader.Read();
				schema = new SchemaDescription
				{
					Id = reader.GetString(headerIndex).Trim(),
					Name = reader.GetString(schemaNameIndex).Trim(),
					AllowAnonymosly = reader.IsDBNull(anonymusIndex) ? null : reader.GetString(anonymusIndex),
					Types = new List<SchemaType>()
				};
			}

			var typeIndex = 0;
			var nameIndex = 1;
			var dbIndex = 2;
			var krepIndex = 3;
			anonymusIndex = 4;
			var conditionIndex = 5;
			////Запрос на сервер, для получение Join'ов
			var joins = GetJoins(schema.Id, anonymousСall).Result;

			command = _client.CreateCommand(@"select GQTYPE.ID, GQTYPE.NAME, GQTYPE.DB, GQTYPE.KREP, GQTYPE.ALLOWANON, GQTYINSC.CONDITION from GQTYPE join GQTYINSC on GQTYINSC.IDTYPE = GQTYPE.ID and GQTYINSC.IDSCHEMA = @schemaid");
			command.Parameters.Add(new SqlParameter("@schemaid", schema.Id));
			command.Connection.Open();
			using (var reader = command.ExecuteReader())
			{
				if (reader.HasRows)
				{
					while (reader.Read())
					{

						var newType = new SchemaType() {
							Id = reader.GetString(typeIndex).Trim().ToLower(),
							Name = reader.GetString(nameIndex).Trim(),
							TableName = reader.GetString(dbIndex).Trim(),
							BrowseId = reader.GetString(krepIndex).Trim(),
							AllowAnonymosly = reader.IsDBNull(anonymusIndex) ? null : reader.GetString(anonymusIndex).Trim(),
							Condition = reader.IsDBNull(conditionIndex) ? null : reader.GetString(conditionIndex),
							Columns = new List<SchemaColumn>(),
							Joins = new Dictionary<string,  IEnumerable<string>>()
						};
						if (joins.ContainsKey(newType.Id))
						{
							newType.Joins = joins[newType.Id];
						}
						schema.Types.Add(newType);
					}
				}
			}
			command.Connection.Close();

			var expressionIndex = 0;
			var descriptionIndex = 1;
			var columnNameIndex = 2;
			var fieldTypeIndex = 3;
			var decIndex = 4;
			for (var i = 0; i < schema.Types.Count; i++)
			{
				command = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM, REPS.TYPE, REPS.DEC from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
				command.Parameters.Add(new SqlParameter("@repskrep", schema.Types[i].BrowseId));
				command.Parameters.Add(new SqlParameter("@repsdb", schema.Types[i].TableName));
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
								tempColumn.Name = getNewColumnName(schema.Types[i]);
							}
							schema.Types[i].Columns.Add(tempColumn);
						}
					}
				}
				command.Connection.Close();
			}
			return schema;
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
			var joinsInRequest = new List<string>();

			foreach (var name in columns)
			{
				 foreach (var el in type.Columns)
				{
					if (String.Equals(el.Name, name, StringComparison.InvariantCultureIgnoreCase))
					{
						foreach (var join in type.Joins[el.Name])
						{
							if (type.Joins.ContainsKey(el.Name) && joinsInRequest.All(el1 => el1 != join))
							{
								joinsInRequest.Add(join);
							}
						}
						schemaColumns.Add(el);
					}
				}
			}

			//Проверяем, есть ли такой join, если нет, то добавляем
			foreach (var join in type.Joins["#condition#"])
			{
				if (!joinsInRequest.Contains(join))
				{
					joinsInRequest.Add(join);
				}
			}

			//Select к базе
			var selectQuery = string.Join(", ", schemaColumns.Select(e=> $"{e.Expression} as {e.Name}"));

			var resultData = new List<Dictionary<string, object>>();

			var condition = string.Empty;
			if (!string.IsNullOrEmpty(type.Condition))
			{
				condition = $"where {type.Condition}";
			}
			var command = _client.CreateCommand($"select {selectQuery} from {type.TableName} {string.Join(string.Empty, joinsInRequest)} {condition}");

			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				while (reader.Read())
				{
					var dictionary = new Dictionary<string, object>();
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
		/// <param name="reader">Reader </param>
		/// <param name="column">Тип поля</param>
		/// <param name="columnNumber">Номер колонки, чтобы считать </param>
		/// <returns></returns>
		private object getValueColumnType(DbDataReader reader, SchemaColumn column, int columnNumber)
		{
			return reader.IsDBNull(columnNumber) ? null : reader.GetValue(columnNumber);
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

		/// <summary>
		///	Получение Join'ов для каждого типа
		/// </summary>
		/// <param name="webRequest">Запрос к веб расчетам</param>
		/// <param name="SchemaId">Id схемы</param>
		/// <param name="anonymousСall">Анонимный вызов или нет</param>
		/// <returns></returns>
		private async Task<Dictionary<string, Dictionary<string,  IEnumerable<string>>>> GetJoins(string SchemaId, bool anonymousСall)
		{
			var args = "{\"SCHEMAID\":\"" + SchemaId + "\"}";
			try
			{
				var result = await _webRequest.CallWebRequestAsync("GETGQJOINS", args, anonymousСall);
				return JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, IEnumerable<string>>>>(result.Content);
			}
			catch (Exception e)
			{
				return new Dictionary<string, Dictionary<string, IEnumerable<string>>>();
			}
		}
	}
}
