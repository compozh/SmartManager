using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

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
			//Field(p => p.HtmlDescription).Description("Html код");
			Field(p => p.addedPhoto).Description("Фото");
			Field(p => p.Id).Description("Идентификатор");
			Field(p => p.childcount).Description("Количество");
			Field(p => p.childdonecount).Description("Количество");
			Field(p => p.dateadd).Description("Дата добавления");
			Field(p => p.caseid).Description("Количество");
		}
	}
}
