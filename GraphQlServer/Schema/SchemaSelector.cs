using GraphQL;
using GraphQL.Types;

namespace SkdSchema
{
	public class SchemaSelector
	{
		private readonly IDependencyResolver _resolver;

		public SchemaSelector(IDependencyResolver resolver)
		{
			_resolver = resolver;
		}

		public ISchema GetMatchSchema(string schemaName, bool anonymous—all)
		{
			return new CommonSchema.CommonSchema(_resolver, schemaName, anonymous—all);
		}
	}
}