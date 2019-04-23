using System;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace ItGraphQlSchema.CommonSchema
{
	/// <summary>
	/// Расширение для Field
	/// </summary>
	public static class ObjectGraphTypeExtensions
	{
		public static void Field(
			this IObjectGraphType obj,
			string name,
			IGraphType type,
			string description = null,
			QueryArguments arguments = null,
			Func<ResolveFieldContext, object> resolve = null)
		{
			var field = new FieldType();
			field.Name = name;
			field.Description = description;
			field.Arguments = arguments;
			field.ResolvedType = type;
			field.Resolver = resolve != null ? new FuncFieldResolver<object>(resolve) : null;
			obj.AddField(field);
		}

		public static void DictionaryField(
			this IObjectGraphType obj,
			IGraphType type,
			string name,
			string description = null,
			QueryArguments arguments = null,
			Func<ResolveFieldContext, object> resolve = null)
		{
			var field = new FieldType();
			field.Name = name;
			field.Description = description;
			field.Arguments = arguments;
			field.ResolvedType = type;
			field.Resolver = new DictionaryFieldResolver();
			obj.AddField(field);
		}
	}
}
