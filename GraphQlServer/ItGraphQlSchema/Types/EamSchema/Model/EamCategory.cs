using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestCategory : SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
	}
}
