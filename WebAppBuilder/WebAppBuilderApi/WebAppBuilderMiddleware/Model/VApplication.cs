using System.Collections.Generic;

namespace WebAppBuilderMiddleware.Model
{
	public class VApplication
	{
		
		public string Id { get; set; }

		
		public string Name { get; set; }

		
		public VComponent RootComponent { get; set; }

		
		public List<VRoute> Routes { get; set; }
	}
}