using System.Collections.Generic;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EquipmentFailureType :SimpleDictionaryRecord
	{
		public List<ConditionParameterAdditionalData> ConditionParameterAdditionalData { get; set; }
	}
}