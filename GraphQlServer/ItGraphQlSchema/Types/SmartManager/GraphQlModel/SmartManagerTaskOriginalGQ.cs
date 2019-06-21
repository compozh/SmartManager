using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AddInDIAttribute]
	class SmartManagerTaskOriginalGQ : ObjectGraphType<SmartManagerTaskOriginals>
	{
		public SmartManagerTaskOriginalGQ()
		{
			Name = "Originals";
			Field(p => p.Id).Description("Идентификатор");
			Field(p => p.Ndor).Description("Номер");
			Field(p => p.FileName).Description("Имя документа");
			Field(p => p.User).Description("Имя пользователя");
			Field(name:"Date",p => p.Date.ToString("dd.MM.yyyy HH:mm")).Description("Дата документа");
			Field(p => p.IsMy).Description("Признак от меня");
			Field(p => p.FileExt).Description("Расширение файла");
			Field(p => p.Comm).Description("Коментарий");
			Field(p => p.FileSize).Description("Размер файла");
			Field(p => p.Type).Description("Тип файла");
			Field(p => p.TypeName).Description("Название типа");
			Field(p => p.TypeDescription).Description("Описание типа");
			Field(p => p.IsSign).Description("Признак назначения");
			Field(p => p.File);
		}
	}
}
