using System.Collections.Generic;
using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.Model;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITEnterpriseMenuQuery:ObjectGraphType<object>
	{
		ITPortalProvider _provider;
		public ITEnterpriseMenuQuery(ITPortalProvider provider)
		{
			_provider = provider;
			Name = "Query";
			Field<ITMenu>("Menu", resolve: getMenu);

			Field<MenuModule>("ModuleContent",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "codeMenu", Description = "Код модуля" }),
				resolve: (context => _provider.GetModuleContent(context.GetArgument<string>("codeMenu")).Result),
				description: "Список каталогов модуля");
		}

		private ITMenu getMenu(ResolveFieldContext<object> context)
		{
			return _provider.GetMenu().Result;
		}
	}
}