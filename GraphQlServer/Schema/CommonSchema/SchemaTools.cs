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
			int conditionIndex = 1;
			int schemaNameIndex = 2;
			int browseIndex = 3;
			int tableIndex = 4;
			var command = _client.CreateCommand("select GQSCHEM.ID, GQSCHEM.CONDITION, GQSCHEM.NAME, GQSCHEM.KREP, GQSCHEM.DB from GQSCHEM where GQSCHEM.ID = @gqshemid");
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
					Condition = reader.IsDBNull(conditionIndex) ? null : reader.GetString(conditionIndex).Trim(),
					Name = reader.GetString(schemaNameIndex).Trim(),
					BrowseId = reader.GetString(browseIndex).Trim(),
					TableName = reader.GetString(tableIndex).Trim(),
					Columns = new List<SchemaColumn>()
				};
			}

			var expressionIndex = 0;
			var descriptionIndex = 1;
			var nameIndex = 2;
			command = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
			command.Parameters.Add(new SqlParameter("@repskrep", shcema.BrowseId));
			command.Parameters.Add(new SqlParameter("@repsdb", shcema.TableName));
			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				while (reader.Read())
				{
					shcema.Columns.Add(new SchemaColumn
					{
						Expression = reader.GetString(expressionIndex).Trim(),
						Name = reader.IsDBNull(nameIndex) ? null : reader.GetString(nameIndex).Trim(),
						Description =  reader.GetString(descriptionIndex).Trim(),
					});
				}
			}
			command.Connection.Close();
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

			foreach (var el in schema.Columns)
			{
				foreach (var name in names)
				{
					if (el.Name.ToLower() == name)
					{
						expressions.Add(el.Expression);
					}
				}
			}
			//Select к базе
			string selectQuery = string.Join(", ", expressions);

			var resultData = new List<Dictionary<string, object>>();
			var command = _client.CreateCommand(String.Format("select {0} from {1}", selectQuery, schema.TableName));
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
			return resultData;
		}
	}
}
