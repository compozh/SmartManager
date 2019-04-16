using System.Collections.Generic;

namespace WebAppBuilderMiddleware.Model
{
	public class VRoute
	{
		public string Id { get;set;}
		public string Path { get; set; }
		public bool AllowAnonymous { get; set; }
		public string Name { get; set; }
		public string Sort { get; set; }
		public List<VComponent> Components { get;set;}
		public List<VRoute> Children { get;set;}
	}
}