using System;
using System.Collections.Generic;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace ItGraphQlSchema.CommonSchema
{
	/// <summary>
	/// Расширение для Field
	/// </summary>
	public class DictionaryFieldResolver : IFieldResolver
	{
		public object Resolve(ResolveFieldContext context)
		{
			var source = context.Source;

			if (!(source is Dictionary<string, object> dict))
			{
				return null;
			}
			// add this lines to support dictionary
			dict = new Dictionary<string, object>(dict, StringComparer.InvariantCultureIgnoreCase);

			if (!dict.ContainsKey(context.FieldAst.Name))
			{
				throw new InvalidOperationException($"Expected to find key {context.FieldAst.Name} on dictionary but it does not exist.");
			}
			return dict[context.FieldAst.Name];
		}
	}
}
