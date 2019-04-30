using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace PurchasesSchema
{
	public class ApplicationType : ObjectGraphType<Application>
	{
		public ApplicationType(IPurchasesProvider provider)
		{
			Name = "Appliccation";

			Field(p => p.UniqueNumber).Description("Идентификатор заявки");
			Field(p => p.Number).Description("Номер заявки");
			Field(p => p.Date).Description("Дата заявки");
		}
	}


	public class ApplicationTableType : ObjectGraphType
	{
		public ApplicationTableType()
		{
			Name = "ApplicationTable";
			Field<ListGraphType<ApplicationType>>("data", description: "Данные таблицы с заявками");
			Field<ListGraphType<ApplicationColumnType>>("columns", description: "Перечень колонок");
		}
	}


	public class ApplicationColumnType : ObjectGraphType
	{
		public ApplicationColumnType()
		{
			Name = "ApplicationColumns";
			Field<StringGraphType>("key", "Ключ колонки");
			Field<StringGraphType>("caption", "Заголовок колонки");
		}

	}
}
