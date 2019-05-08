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
			Field<ITMenuItems>("Menu", resolve: getFavoriteItems);
		}

		private ITMenuItems getFavoriteItems(ResolveFieldContext<object> context)
		{
			var t = _provider.GetModuleContent("").Result;
			var data = _provider.GetMenu().Result;
			return data;
		}
	}
}