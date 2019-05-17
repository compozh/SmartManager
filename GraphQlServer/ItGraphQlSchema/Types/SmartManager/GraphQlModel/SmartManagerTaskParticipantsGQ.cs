using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AtributeAddInDI]
	public class SmartManagerTaskParticipantsGQ : ObjectGraphType<SmartManagerTaskParticipants>
	{
		public SmartManagerTaskParticipantsGQ()
		{
			Name = "Participants";
			Field(p => p.UserId);
			Field(p => p.UserFio);
			Field(p => p.Role);
		}
	}
}
