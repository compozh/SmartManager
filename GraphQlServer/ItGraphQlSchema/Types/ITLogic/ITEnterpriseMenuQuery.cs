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
		}

		private ITMenu getMenu(ResolveFieldContext<object> context)
		{
			return _provider.GetMenu().Result;
		}
	}
}