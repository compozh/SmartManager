using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class SkdPersonTableType : ObjectGraphType, IItAddInSingleton
	{
		public SkdPersonTableType()
		{
			Name = "PersonsTable";
			Field<ListGraphType<SkdPersonType>>("data", description: "Данные таблицы с пользователями");
			Field<ListGraphType<SkdPersonColumnType>>("columns", description: "Перечень колонок");
		}
	}
}
