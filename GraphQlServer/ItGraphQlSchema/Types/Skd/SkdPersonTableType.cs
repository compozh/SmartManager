using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class SkdPersonTableType : ObjectGraphType
	{
		public SkdPersonTableType()
		{
			Name = "PersonsTable";
			Field<ListGraphType<SkdPersonType>>("data", description: "Данные таблицы с пользователями");
			Field<ListGraphType<SkdPersonColumnType>>("columns", description: "Перечень колонок");
		}
	}
}
