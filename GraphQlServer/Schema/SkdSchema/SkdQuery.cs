using GraphQL.Types;

namespace SkdSchema
{
	public class SkdQuery:ObjectGraphType<object>
	{
		public SkdQuery()
		{
			Name = "Query";
			Field<ListGraphType<SkdPersonType>>(
				"persons",
				arguments: new QueryArguments(
					new QueryArgument<StringGraphType> { Name = "userId", Description = "”никальный идентификатор пользовател€" }
					),
				resolve: (context => new SkdPersonProvider().Persons)
				
				);
		}
	}
}