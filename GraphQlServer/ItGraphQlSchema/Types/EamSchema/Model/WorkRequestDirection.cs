using System.Collections.Generic;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestDirection : SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
		public List<ConditionParameterType> ConditionParameterTypes { get; set; }
		
		public List<ConditionParameterAdditionalData> ConditionParameterAdditionalData { get; set; }
		
		public List<ResponsibleSpecialist> ResponsibleSpecialists { get; set; }
	}
}
