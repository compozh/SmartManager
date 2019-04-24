using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace PurchasesSchema
{
	class PurchasesSchema : Schema
	{
		public PurchasesSchema(IDependencyResolver dependencyResolver) : base(dependencyResolver)
		{

			Query = dependencyResolver.Resolve<PurchasesQuery>();

		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<IPurchasesProvider, PurchasesProvider>();
			services.AddSingleton<PurchasesSchema>();
			services.AddSingleton<PurchasesQuery>();

			services.AddSingleton<CartItem>();
			services.AddSingleton<CartItemType>();
			services.AddSingleton<CartTableType>();
			services.AddSingleton<CartItemColumnType>();
		}
	}
}
