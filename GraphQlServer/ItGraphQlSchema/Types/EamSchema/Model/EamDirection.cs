using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestDirection : SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
	}
}
