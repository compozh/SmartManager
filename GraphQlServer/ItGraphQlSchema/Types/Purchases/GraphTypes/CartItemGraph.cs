using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.Purchases
{
	[AddInDI, GraphType(typeof(CartItem))]
	public class CartItemGraph : EfObjectGraphType<CartItem>
	{
		public CartItemGraph(IEfGraphQLService graphQlService) : base(graphQlService)
		{
			Name = "CartItem";
			Field(p => p.Id).Description("Идентификатор элемента");
			Field(p => p.ResourceId).Description("Идентификатор ресурса");
			Field(p => p.ResourceName).Description("Наименование ресурса");
			Field(p => p.Quantity).Description("Количество");
			AddNavigationField(
				name: "measurementUnit",
				resolve: context => context.Source.MeasurementUnit);
			AddNavigationField(
				name: "resource",
				resolve: context => context.Source.Resource);
			Field(p => p.DateDelivery, nullable:true).Description("Плановая дата поставки");
		}
	}
}
