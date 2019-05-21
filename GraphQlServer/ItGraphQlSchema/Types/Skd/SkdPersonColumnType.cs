using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AddInDIAttribute]
	public class SkdPersonColumnType : ObjectGraphType
	{
		public SkdPersonColumnType()
		{
			Name = "PersonsColumns";
			Field<StringGraphType>("key", "Ключ колонки");
			Field<StringGraphType>("caption", "Заголовок колонки");
		}
	}
}
