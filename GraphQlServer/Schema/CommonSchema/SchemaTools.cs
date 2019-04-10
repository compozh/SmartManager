using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
			var one = "";
			var two = "";
			var three = "";
			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				while (reader.Read())
				{
					shcema.Types.Add(new SchemaType
					{
						Id = reader.GetString(typeIndex).Trim(),
						Name = reader.GetString(nameIndex).Trim(),
						TableName=reader.GetString(dbIndex).Trim(),
						BrowseId = reader.GetString(krepIndex).Trim(),
						Anonymously = reader.IsDBNull(anonymusIndex) ? null :  reader.GetString(anonymusIndex).Trim(),
						Condition = reader.GetString(conditionIndex),
						Columns = new List<SchemaColumn>()
					});
				}
			}
			command.Connection.Close();

			var expressionIndex = 0;
			var descriptionIndex = 1;
			var columnNameIndex = 2;
			for (int i = 0; i < shcema.Types.Count; i++)
			{
				command = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
				command.Parameters.Add(new SqlParameter("@repskrep", shcema.Types[i].BrowseId));
				command.Parameters.Add(new SqlParameter("@repsdb", shcema.Types[i].TableName));
				command.Connection.Open();
				using (var reader = command.ExecuteReader())
				{
					if (!reader.HasRows)
					{
						return null;
					}

					int increment = 0;
					while (reader.Read())
					{
						var tempColumn = new SchemaColumn
						{
							Expression = reader.IsDBNull(expressionIndex) ? null : reader.GetString(expressionIndex).Trim(),
							Description = reader.IsDBNull(nameIndex) ? null : reader.GetString(nameIndex).Trim(),
							Name = reader.GetString(columnNameIndex).Trim(),
						};
						if (tempColumn.Name == "")
						{
							tempColumn.Name = "cell" + increment++;
						}

						shcema.Types[i].Columns.Add(tempColumn);
					}
				}
				command.Connection.Close();
			}

			return shcema;
		}

		/// <summary>
		/// Метод для получение колонок схемы
		/// </summary>
		/// <param name="schema"> Схема</param>
		/// <param name="names"> Поля, который запрашиваем </param>
		/// <returns></returns>
		public List<Dictionary<string, object>> GetDataForQueriedColumns(SchemaDescription schema, List<string> names)
		{
			var expressions = new List<string>();

			foreach (var type in schema.Types)
			{
				foreach (var el in type.Columns)
				{
					foreach (var name in names)
					{
						if (el.Name.ToLower() == name)
						{
							expressions.Add(el.Expression);
						}
					}
				}
			}
			//Select к базе
			string selectQuery = string.Join(", ", expressions);

			var resultData = new List<Dictionary<string, object>>();

			foreach (var type in schema.Types)
			{
				string condition = "";
				if (type.Condition != "")
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
						for (int i = 0; i < expressions.Count; i++)
						{
							dictionary.Add(names[i], reader.GetString(i).Trim());
						}
						resultData.Add(dictionary);
					}
				}
				command.Connection.Close();
			}
			return resultData;
		}
	}
}
