using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	[AddInDIAttribute]
	public class SkdQuery : ObjectGraphType<object>
	{
		public SkdQuery(SkdPersonProvider provider)
		{
			Name = "Query";

			async Task<object> Resolve(ResolveFieldContext<object> context)
			{
				var users = await provider.GetPersons(context.GetArgument<string>("userId"));

				var subfields = context.SubFields["data"].SelectionSet.Children.Cast<GraphQL.Language.AST.Field>();//.Select(s => s.Name).ToList();

				var columns = new SkdPersonType(provider).Fields;

				var result = new
				{
					data = users.ToList(),
					columns = subfields.Select(s => {
						var col = columns.FirstOrDefault(c => c.Name.Equals(s.Name, StringComparison.InvariantCultureIgnoreCase));
						return col == null ? null : new { key = s.Name, caption = col.Description };
					}).Where(f => f != null)
				};

				return result;
			}

			Field<SkdPersonTableType>("personsTable",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "userId", Description = "Уникальный идентификатор пользователя" }),
				resolve: (Resolve),
				description: "Перечень пользователей из системы контроля доступа");

			Field<ListGraphType<SkdPersonType>>("persons",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "userId", Description = "Уникальный идентификатор пользователя" }),
				resolve: (context => provider.GetPersons(context.GetArgument<string>("userId"))),
				description: "Перечень пользователей из системы контроля доступа");

			Field<ListGraphType<SkdPersonType>>("personsPhoto",
				arguments: new QueryArguments(new QueryArgument<ListGraphType<StringGraphType>> { Name = "userIds", Description = "Уникальные идентификаторы пользователя" }),
				resolve: (context => provider.GetPersonsPhotos(context.GetArgument<List<string>>("userIds"))),
				description: "Ссылки на фотографии пользователей");
		}


	}
}
