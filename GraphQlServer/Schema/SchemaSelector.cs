using GraphQL;
using GraphQL.Types;

namespace SkdScheme
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
			if (typeof(SkdSchema.SkdSchema).Name == schemaName)
			{
				return _resolver.Resolve<SkdSchema.SkdSchema>();
			}
			else
			{
				return new CommonSchema.CommonSchema(_resolver, schemaName, anonymous—all);
			}
		}
	}
}