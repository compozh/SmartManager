using GraphQL;
using GraphQL.Types;

namespace ItGraphQlSchema
{
	public class SchemaSelector
	{
		private readonly IDependencyResolver _resolver;

		public SchemaSelector(IDependencyResolver resolver)
		{
			_resolver = resolver;
		}

		public ISchema GetMatchSchema(string schemaName, bool anonymousCall)
		{
			return new CommonSchema.CommonSchema(_resolver, schemaName, anonymousCall);
		}
	}
}