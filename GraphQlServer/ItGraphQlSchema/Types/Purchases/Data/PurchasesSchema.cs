using GraphQL;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.Purchases
{
	[AddInDI]
	internal class PurchasesSchema : Schema
	{
		public PurchasesSchema(IDependencyResolver resolver) : base(resolver)
		{
			Query = resolver.Resolve<PurchasesQuery>();
		}
	}
}
