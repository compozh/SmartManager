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
			if (typeof(PurchasesSchema.PurchasesSchema).Name == schemaName)
			{
				return _resolver.Resolve<PurchasesSchema.PurchasesSchema>();
			}
			else
			{
				return new CommonSchema.CommonSchema(_resolver, schemaName, anonymous—all);
			}
		}
	}
}