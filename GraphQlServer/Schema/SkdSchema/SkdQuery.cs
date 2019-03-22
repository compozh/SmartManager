using System.Collections;
using System.Collections.Generic;
using GraphQL.Types;

namespace SkdSchema
{
	public class SkdQuery:ObjectGraphType<object>
	{
		public SkdQuery(ISkdPersonProvider provider)
		{
			Name = "Query";
			Field<ListGraphType<SkdPersonType>>("persons",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "userId", Description = "”никальный идентификатор пользовател€" }),
				resolve: (context => provider.GetPersons(context.GetArgument<string>("userId"))), 
				description: "ѕеречень пользователей из системы контрол€ доступа");
			
			Field<ListGraphType<SkdPersonType>>("personsPhoto",
				arguments: new QueryArguments(new QueryArgument<ListGraphType<StringGraphType>> { Name = "userIds", Description = "”никальные идентификаторы пользовател€" }),
				resolve: (context => provider.GetPersonsPhotos(context.GetArgument<List<string>>("userIds"))),
				description: "—сылки на фотографии пользователей");
		}
	}
}