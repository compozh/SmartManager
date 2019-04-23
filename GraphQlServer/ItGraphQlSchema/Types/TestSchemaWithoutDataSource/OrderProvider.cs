using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using ItGraphQlSchema.Types;
using Web.Data;

namespace ItGraphQlSchema.Types
{
	 public class OrderProvider : IItAddInSingleton
	{
		private readonly SqlClient _client;

		public OrderProvider(SqlClient client)
		{
			_client = client;
		}

		public async Task<IEnumerable<object>> GetOrders()
		{
			var indexId = 0;
			var indexName = 1;
			var indexItem = 2;
			var orders = new List<object>();
			var command = _client.CreateCommand($"select _GQORDER.ID, _GQORDER.NAME, _GQITEM.NAME from _GQORDER join _GQITEM on _GQORDER.IDGQITEM = _GQITEM.NAME");
			command.Connection.Open();

			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				while (reader.Read()) { 
					var order = new Order(){
						Id = reader.GetInt32(indexId),
						Name = reader.IsDBNull(indexName) ? null : reader.GetString(indexName).Trim(),
						IdOrderItem = reader.IsDBNull(indexItem) ? null : reader.GetString(indexItem).Trim()
					};
					orders.Add(order);
				}
			}
			command.Connection.Close();

			return orders;
		}
	}
}
