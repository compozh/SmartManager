using System.Collections.Generic;

namespace SkdScheme.CommonSchema
{
	public	class SchemaDescription
	{
		public string Name { get; set; }
		public string Id { get; set; }
		public string AllowAnonymosly { get; set; }
		public List<SchemaType> Types { get; set; }
	}

	public class SchemaType
	{
		public string Id { get; set; }
		public string AllowAnonymosly { get; set; }
		public string TableName { get; set; }
		public string BrowseId { get; set; }
		public string Name { get; set; }
		public string Condition { get; set; }
		public List<SchemaColumn> Columns { get; set; }
		public Dictionary<string, IEnumerable<string>> Joins { get; set; }
	}

	public class SchemaColumn
	{
		public string Name { get; set; }
		public string Expression { get; set; }
		public string Description { get; set; }
		public SlvColumnType Type { get; set; }
	}
}
