using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.Purchases
{
	[AddInDI]
	class PurchasesQuery : QueryGraphType
	{
		IPurchasesDataProvider _dataProvider;

		public PurchasesQuery(IEfGraphQLService efGraphQlService, IPurchasesDataProvider dataProvider) :
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

			//Field<ListGraphType<ResourceGraph>>(
			//	name: "",
			//	arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "folderId", Description = "Уникальный идентификатор задачи" }),
			//	resolve: (context => provider.GetTasksAsync(context.GetArgument<string>("folderId"))),
			//	description: "Задачи");

			AddQueryField(
				name: "resources",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "name", Description = "Имя ресурса" }),
				resolve: context => _dataProvider.GetResorces(context.GetArgument<string>("name")));

			AddQueryField(
				name: "resourcesGrops",
				resolve: context => _dataProvider.ResourcesGroups);

			AddQueryConnectionField(
				name: "departmentConnection",
				resolve: context => _dataProvider.Departments);

			AddQueryConnectionField(
				name: "employeesConnection",
				resolve: context => _dataProvider.Employees);

			AddQueryConnectionField(
				name: "resourcesConnection",
				resolve: context => _dataProvider.Resources);

			AddQueryConnectionField(
				name: "resourcesGropsConnection",
				resolve: context => _dataProvider.ResourcesGroups);

			AddQueryField("cartItems", c => _dataProvider.CartItems);
			AddQueryConnectionField("cartItemsConnection", c => _dataProvider.CartItems);
		}
	}
}
