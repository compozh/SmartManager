using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AddInDIAttribute]
	public class SmartManagerTaskCommentsGQ : ObjectGraphType<SmartManagerTaskComment>
	{
		public SmartManagerTaskCommentsGQ()
		{
			Name = "Comments";
			Field(p => p.UserId).Description("Идентификатор пользователя");
			Field(p => p.User).Description("Имя пользователя");
			Field(name:"Date",p => p.Date.ToString("dd.MM.yyyy HH:mm")).Description("Дата и время коментария");
			Field(p => p.Text).Description("Текст коментария");
			Field(p => p.IsAgree, nullable:true).Description("Назначен");
		}
	}
}
