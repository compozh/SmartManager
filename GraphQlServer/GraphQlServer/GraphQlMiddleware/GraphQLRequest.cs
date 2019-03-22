using Newtonsoft.Json.Linq;

namespace GraphQlServer
{
	public class GraphQLRequest
	{
		public string SchemaName { get; set; }
		public string OperationName { get; set; }
		public string Query { get; set; }
		public JObject Variables { get; set; }
	}
}