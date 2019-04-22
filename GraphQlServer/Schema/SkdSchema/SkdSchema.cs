using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using GraphQL.Resolvers;
using GraphQL.Types;
using GraphQL.Utilities;
using Microsoft.Extensions.DependencyInjection;
using SkdSchema.Types;

namespace SkdSchema
{
	public class SkdSchema:Schema
	{
		public SkdSchema(IDependencyResolver dependencyResolver) : base(dependencyResolver)
		{
		
			Query = dependencyResolver.Resolve<SkdQuery>();			
			
		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<ISkdPersonProvider, SkdPersonProvider>();
			services.AddSingleton<SkdSchema>();
			services.AddSingleton<SkdQuery>();
			
			services.AddSingleton<SkdPersonType>();
			services.AddSingleton<SkdPersonPhotoType>();
			services.AddSingleton<SkdPersonTableType>();
			services.AddSingleton<SkdPersonColumnType>();
		}
	}
	
	
	
}