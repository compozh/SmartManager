using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types
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

			AddQueryField(
				name: "resources",
				resolve: context => _dataProvider.Resources);

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

			AddQueryField("applications", c => _dataProvider.Applications);
			AddQueryConnectionField("applicationsConnection", c => _dataProvider.Applications);
		}
	}
}
