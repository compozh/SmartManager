using GraphQL;
using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.Model;
using Microsoft.AspNetCore.Http;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITEnterpriseMenuQuery:ObjectGraphType<object>
	{
		ITPortalProvider _provider;
		private IHttpContextAccessor _httpContext;
		public ITEnterpriseMenuQuery(ITPortalProvider provider, IHttpContextAccessor httpContext)
		{
			_httpContext = httpContext;
			_provider = provider;
			Name = "Query";
			Field<ITMenu>("Menu", resolve: getMenu);

			Field<MenuModule>("ModuleContent",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "codeMenu", Description = "Код модуля" }),
				resolve: (context => _provider.GetModuleContent(context.GetArgument<string>("codeMenu")).Result),
				description: "Список каталогов модуля");
			Field<UserAccount>("User", resolve: getUser);
		}

		private ITMenu getMenu(ResolveFieldContext<object> context)
		{
			return _provider.GetMenu().Result;
		}
		private UserAccount getUser(ResolveFieldContext<object> context)
		{
			var userLogin = _httpContext.HttpContext.User.Identity.GetValue().GetPropertyValue("Name");
			return _provider.GetUserAccount(userLogin.ToString()).Result;
		}
	}
}