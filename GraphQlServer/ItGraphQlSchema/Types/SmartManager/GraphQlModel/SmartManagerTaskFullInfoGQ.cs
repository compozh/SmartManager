using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.GraphQlModel;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager
{
	
	[AddInDIAttribute]
	public class SmartManagerTaskFullInfoGQ : ObjectGraphType<SmartManagerTaskFullInfo>
	{
		public SmartManagerTaskFullInfoGQ(SmartManagerProvider provider)
		{
			Name = "TasksGetInfo";
			Field(p => p.Id).Description("Уникальный номер задачи");
			Field(p => p.Name).Description("Название задачи");
			Field(p => p.Descript).Description("Описание в текстовом формате");
			Field(p => p.HtmlDescript, nullable:true).Description("Описание (html)");
			Field(p => p.DeclarerId).Description("Идентификатор заявителя");
			Field(p => p.Declarer).Description("ФИО заявителя");
			Field(p => p.DeclarerPhoto).Description("Хеш-ссылка на фото заявителя");
			Field(p => p.PerformerId).Description("Идентификатор исполнителя");
			Field(p => p.Performer).Description("ФИО исполнителя");
			Field(name:"Dateplan",p => p.Dateplan.ToString("dd.MM.yyyy HH:mm")).Description("Плановая дата");
			Field(name:"DateAdd",p => p.DateAdd.ToString("dd.MM.yyyy HH:mm")).Description("Дата добавления");
			Field(p => p.Status).Description("Статус задачи");
			Field(p => p.IsMy).Description("Признак задачи от меня");
			Field(p => p.MyControl).Description("На моем контроле");
			Field(p => p.IsGenerate).Description("Сгенерирована/нет (true/false)");
			Field(p => p.NeedApprov).Description("Требует утверждения");
			Field(p => p.NeedComm).Description("Требует комментария");
			Field(p => p.Arso).Description("Объект бизнес процессов");
			Field(p => p.KeyValue).Description("Ключ документа");
			Field(p => p.KidCopy).Description("Код копии документу");
			Field(p => p.HasOrig).Description("Наличие вложений");
			Field(p => p.HasComm).Description("Наличие комментариев");
			Field(p => p.IsAgree).Description("Задача согласования");
			Field(p => p.IsResponsible).Description("Исполнитель задачи является ответственным");
			Field(p => p.ChildCount).Description("Количество подзадач");
			Field(p => p.ChildDoneCount).Description("Количество выполненых подзадач");
			Field(p => p.Priority).Description("Приоритет");
			Field(name:"DateRemind",p => p.DateRemind.ToString("dd.MM.yyyy HH:mm")).Description("Дата напоминания");
			Field(p => p.AddedId).Description("Идентификатор создателя");
			Field(p => p.AddedFio).Description("ФИО создателя");
			Field(p => p.AddedPhoto).Description("Хеш-ссылка на фото создателя");
			Field(name:"DateFact",p => p.DateFact.ToString("dd.MM.yyyy HH:mm")).Description("Дата фактического выполнения");
			Field(p => p.IsRead).Description("Признак о прочтении");
			Field(p => p.CaseId).Description("Идентификатор кейса");
			Field(p => p.DocCaption, nullable: true).Description("Номер и дата документа или название кейса");
			// Вложенные объекты 
			Field<ListGraphType<SmartManagerTaskOriginalGQ>>("Originals", resolve: context => context.Source.Originals);
			Field<ListGraphType<SmartManagerTaskCommentsGQ>>("Comments", resolve: context => context.Source.Comments); 
			Field<ListGraphType<SmartManagerTaskFullInfoGQ>>("ChildTasks", resolve: context => context.Source.ChildTasks); 
			Field<ListGraphType<SmartManagerTaskParticipantsGQ>>("Participants", resolve: context => context.Source.Participants);
		}
	}
}
