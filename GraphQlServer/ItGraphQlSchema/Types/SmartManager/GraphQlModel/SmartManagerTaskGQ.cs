using GraphQL.Types;
using System;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AtributeAddInDI]
	class SmartManagerTaskGQ : ObjectGraphType<SmartManagerTask>
	{
		public SmartManagerTaskGQ(SmartManagerProvider provider)
		{
			Name = "Tasks";
			Field(p => p.name).Description("Название задачи");
			Field(p => p.addedFio).Description("Имя");
			Field(p => p.addedPhoto).Description("Фото");
			Field(p => p.Id).Description("Идентификатор");
			Field(p => p.dateadd).Description("Дата добавления");
			Field(p => p.caseid).Description("Количество");
		}
	}
	
	public class SmartManagerTask
	{
		public int Id { get; set; }
		public string name { get; set; }
		public string addedFio { get; set; }
		public string addedPhoto { get; set; }
		public DateTime dateadd { get; set; }
		public int caseid { get; set; }
	}
}
