using System.Collections.Generic;

namespace WebAppBuilderMiddleware.Model
{
	public class VSection
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public List<VRoute> Routes { get; set; } 
		public string Properties { get; set; }	
	}
}