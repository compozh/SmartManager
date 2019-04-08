using System.Collections.Generic;

namespace WebAppBuilderApi.Model
{
	public class VRoute
	{
		public string Id { get;set;}
		public string Path { get; set; }
		public bool AllowAnonymous { get; set; }
		public string Name { get; set; }
		
		public List<VComponent> Components { get;set;}
		public List<VRoute> Children { get;set;}
	}
}