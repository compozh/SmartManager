using System.Collections.Generic;

namespace WebAppBuilderApi.Model
{
	public class VComponent
	{
		public string Id { get; set; }
		public string Name { get;set; }
		public string NameInRoute { get;set;}
		public List<VComponentProperty> Properties { get; set; }
		public string DataSource { get; set; }
		public string DataSourceSchema { get; set; }
		public string Slot { get; set; }
		public string Sort { get; set; }
		public List<VComponent> ChildComponents { get; set; }
	}
}