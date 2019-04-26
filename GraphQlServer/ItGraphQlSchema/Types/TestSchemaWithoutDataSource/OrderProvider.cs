using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Web.Data;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class OrderProvider
	{
		private readonly SqlClient _client;

		public OrderProvider(SqlClient client)
		{
			_client = client;
		}

		public async Task<IEnumerable<Order>> GetOrders()
		{
			var indexId = 0;
			var indexName = 1;
			var indexItem = 2;
			var orders = new List<Order>();
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
					};
					orders.Add(order);
				}
			}
			command.Connection.Close();

			return orders;
		}
		public async Task<List<Item>> GetItemsForOrder(Order order)
		{
			var items = new List<Item>();
			var indexId = 0;
			var indexName = 1;
			var command = _client.CreateCommand($"select _GQITEM.ID, _GQITEM.NAME from _GQITEM join _GQORDER on _GQORDER.NAME = @ordername and _GQITEM.NAME = _GQORDER.IDGQITEM");
			command.Parameters.Add(new SqlParameter("@ordername", order.Name));
			command.Connection.Open();
			using (var reader = command.ExecuteReader())
			{
				if (!reader.HasRows)
				{
					return null;
				}
				while (reader.Read())
				{
					var item = new Item
					{
						Id = reader.GetInt32(indexId),
						Name = reader.IsDBNull(indexName) ? null : reader.GetString(indexName).Trim()
					};
					items.Add(item);
				}
			}
			command.Connection.Close();

			return items;
		}
	}
}
