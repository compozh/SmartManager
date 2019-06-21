using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AddInDIAttribute]
	public class SmartManagerTaskParticipantsGQ : ObjectGraphType<SmartManagerTaskParticipants>
	{
		public SmartManagerTaskParticipantsGQ()
		{
			Name = "Participants";
			Field(p => p.UserId).Description("Идентификатор соучасника");
			Field(p => p.UserFio).Description("ФИО соучасника");
			Field(p => p.Name).Description("Имя");
			Field(p => p.Role).Description("Роль");
		}
	}
}
