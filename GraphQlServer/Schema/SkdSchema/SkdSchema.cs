using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

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
		}
	}
	
}