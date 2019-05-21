using GraphQL;
using GraphQL.Types;
using GraphQL.Utilities;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.EamSchema.GraphTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI]
	class EamSchema : Schema
	{
		public EamSchema(IDependencyResolver resolver) : base(resolver)
		{
			Query = resolver.Resolve<EamQuery>();
		}
	}
}
