using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ItGraphQlSchema.Types.Purchases
{
	[AddInDI]
	class PurchasesQuery : QueryGraphType<CommonDbContext>
	{
		IPurchasesDataProvider _dataProvider;

		public PurchasesQuery(IEfGraphQLService<CommonDbContext> efGraphQlService, IPurchasesDataProvider dataProvider) :
			base(efGraphQlService)
		{
			_dataProvider = dataProvider;
			Name = "PurchasesQuery";

			AddQueryField(
				name: "applications",
				resolve: context => _dataProvider.Applications);

			AddQueryField(
				name: "employees",
				resolve: context => _dataProvider.Employees);

			AddQueryField(
				name: "itObjects",
				resolve: context => _dataProvider.ItObjects);

			AddQueryField(
				name: "departments",
				resolve: context => _dataProvider.Departments);

			AddQueryField(
				name: "measurementUnits",
				resolve: context => _dataProvider.MeasurementUnits);

			Field<StringGraphType>(
				name: "ElasticResourceNameSearch",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "name", Description = "Имя ресурса" }),
				resolve: context => _dataProvider.GetResorces(context.GetArgument<string>("name")),
				description: "Задачи");

			AddQueryField(
				name: "resources",
				arguments: new QueryArguments(
					new QueryArgument<StringGraphType> { Name = "group", Description = "Код Группы" },
					new QueryArgument<BooleanGraphType> {
						Name = "allIncludedGroups",
						Description = "Все входящиее в группу (по умолчанию не загружать)"}
					),
				resolve: resolveRosources);

			AddQueryField(
				name: "resourcesGrops",
				arguments: new QueryArguments(
					new QueryArgument<StringGraphType> { Name = "group", Description = "Код предка группы" }
					),
				resolve: context => {
					var ret = _dataProvider.ResourcesGroups;
					if (context.HasArgument("group"))
					{
						var parent = context.GetArgument<string>("group");
						ret = ret.Where(g => g.ParentId == parent);
					}
					return ret;
				});

			AddQueryConnectionField(
				name: "departmentConnection",
				resolve: context => _dataProvider.Departments);

			AddQueryConnectionField(
				name: "employeesConnection",
				resolve: context => _dataProvider.Employees);

			AddQueryConnectionField(
				name: "resourcesConnection",
				arguments: new QueryArguments(
					new QueryArgument<StringGraphType> { Name = "group", Description = "Код Группы" },
					new QueryArgument<BooleanGraphType>
					{
						Name = "allIncludedGroups",
						Description = "Все входящиее в группу (по умолчанию не загружать)"
					}
				),
				resolve: resolveRosources);

			AddQueryConnectionField(
				name: "resourcesGropsConnection",
				resolve: context => _dataProvider.ResourcesGroups);

			AddQueryField("cartItems", c => _dataProvider.CartItems);
			AddQueryConnectionField("cartItemsConnection", c => _dataProvider.CartItems);
		}

		private IQueryable<Resource> resolveRosources(ResolveFieldContext<object> context)
		{
			var ret = _dataProvider.Resources;
			if (context.HasArgument("group"))
			{
				var group = context.GetArgument<string>("group");
				if (context.HasArgument("allIncludedGroups") && context.GetArgument<bool>("allIncludedGroups"))
				{
					ret = ret.Where(g => 
						EF.Functions.Like(g.Id, string.Format("{0}%", group.TrimEnd())));
				}
				else
				{
					ret = ret.Where(g => g.ResourceGroupId.Equals(group));
				}
			}
			return ret;
		}
	}
}
