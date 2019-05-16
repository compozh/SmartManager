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
		private IDependencyResolver _dependencyResolver;
		public ITEnterpriseMenuQuery(ITPortalProvider provider, IDependencyResolver dependencyResolver)
		{
			_dependencyResolver = dependencyResolver;
			_provider = provider;
			Name = "Query";
			Field<ITMenu>("Menu", resolve: getMenu);

			Field<MenuModule>("ModuleContent",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "codeMenu", Description = "��� ������" }),
				resolve: (context => _provider.GetModuleContent(context.GetArgument<string>("codeMenu")).Result),
				description: "������ ��������� ������");
			Field<UserAccount>("User", resolve: getUser);
		}

		private ITMenu getMenu(ResolveFieldContext<object> context)
		{
			return _provider.GetMenu().Result;
		}
		private UserAccount getUser(ResolveFieldContext<object> context)
		{
			var httpContext = _dependencyResolver.Resolve<IHttpContextAccessor>();
			var userLogin = httpContext.HttpContext.User.Identity.GetValue().GetPropertyValue("Name");
			return _provider.GetUserAccount(userLogin.ToString()).Result;
		}
	}
}