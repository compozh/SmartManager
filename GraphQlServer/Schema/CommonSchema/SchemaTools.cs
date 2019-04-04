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

		public SchemaObject GetShemaTools(string name)
		{
			SchemaObject shcema;
			int headerIndex = 0;
			int conditionIndex = 1;
			int schemaNameIndex = 2;
			int krepIndex = 3;
			int dbIndex = 4;
			var a = _client.CreateCommand("select GQSCHEM.ID, GQSCHEM.CONDITION, GQSCHEM.NAME, GQSCHEM.KREP, GQSCHEM.DB from GQSCHEM where GQSCHEM.ID = @gqshemid");
			a.Parameters.Add(new SqlParameter("@gqshemid", name));
			a.Connection.Open();

			using (var reader = a.ExecuteReader())
			{
				reader.Read();
				shcema = new SchemaObject
				{
					Id = reader.GetString(headerIndex),
					Condition = reader.IsDBNull(conditionIndex) ? null : reader.GetString(conditionIndex).Trim(),
					Name = reader.GetString(schemaNameIndex).Trim(),
					Krep = reader.GetString(krepIndex).Trim(),
					Db = reader.GetString(dbIndex).Trim(),
					Columns = new List<SchemaColumn>()
				};
			}

			var expressionIndex = 0;
			var descriptionIndex = 1;
			var nameIndex = 2;
			a = _client.CreateCommand("select REPS.FL, REPS.FLR, REPS.BROWNAIM from REPS where REPS.KREP = @repskrep AND REPS.DB = @repsdb ");
			a.Parameters.Add(new SqlParameter("@repskrep", shcema.Krep));
			a.Parameters.Add(new SqlParameter("@repsdb", shcema.Db));
			a.Connection.Open();

			using (var reader = a.ExecuteReader())
			{
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
			a.Connection.Close();
			return shcema;
		}

		public List<Dictionary<string, object>> GetListData(SchemaObject schema, ICollection<string> names)
		{
			List<string> containerQuery = new List<string>();
			List<string> fields = new List<string>();
			foreach (var el in schema.Columns)
			{
				foreach (var name in names)
				{
					if (el.Name.ToLower() == name)
					{
						containerQuery.Add(el.Expression);
						fields.Add(name);
					}
				}
			}
			string selectQuery = string.Join(", ", containerQuery);

			List<Dictionary<string, object>> test = new List<Dictionary<string, object>>();
			var a =_client.CreateCommand(String.Format("select {0} from {1}", selectQuery, schema.Db));
			a.Connection.Open();

			using (var reader = a.ExecuteReader())
			{
				while (reader.Read())
				{
					Dictionary<string, object> dictionary = new Dictionary<string, object>();
					dictionary.Clear();
					for (int i = 0; i < containerQuery.Count; i++)
					{
						dictionary.Add(fields[i], reader.GetString(i).Trim());
					}
					test.Add(dictionary);
				}
			}
			a.Connection.Close();
			return test;
		}
	}
}
