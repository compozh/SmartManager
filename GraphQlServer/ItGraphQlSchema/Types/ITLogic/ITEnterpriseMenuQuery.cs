using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using GraphQL;
using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.GraphTypes;
using ItGraphQlSchema.Types.ITLogic.Model;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Web.Tools;

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
			Field<UserAccountType>("User", resolve: getUser);
		}

		private ITMenu getMenu(ResolveFieldContext<object> context)
		{
			return _provider.GetMenu().Result;
		}
		private UserAccount getUser(ResolveFieldContext<object> context)
		{
			var userLogin = _httpContext.HttpContext.User.Identity.GetValue().GetPropertyValue("Name");
//			var userSession = _httpContext.HttpContext.Session.Get<UserAccount>("ITPortalUserAccount");
//			var te = "Привет мир";
//			if (userSession != null)
//			{
//				return userSession;
//			}
			var user = _provider.GetUserAccount(userLogin.ToString()).Result;

//			_httpContext.HttpContext.Session.Set<UserAccount>("ITPortalUserAccount",user);

			return user;
		}
	}
}