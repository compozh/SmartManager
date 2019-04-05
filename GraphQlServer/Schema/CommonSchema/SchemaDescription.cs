using System.Collections.Generic;

namespace SkdScheme.CommonSchema
{
	public	class SchemaDescription
	{
		public string Name { get; set; }
		public string Id { get; set; }
		public string Condition { get; set; }
		public string BrowseId { get; set; }
		public string TableName { get; set; }
		public List<SchemaColumn> Columns { get; set; }
	}

	public class SchemaColumn
	{
		public string Name { get; set; }
		public string Expression { get; set; }
		public string Description { get; set; }
	}
}
