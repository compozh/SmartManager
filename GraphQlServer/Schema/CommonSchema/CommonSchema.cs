using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using Web.Data;

namespace SkdScheme.CommonSchema
{
	public class CommonSchema : Schema
	{
		public CommonSchema(IDependencyResolver dependencyResolver, string schemaName) : base(dependencyResolver)
		{
			var client = dependencyResolver.Resolve<SqlClient>();
			var schemaDescription = (new SchemaTools(client)).GetShemaTools(schemaName);
			
			var commonSchema = new ObjectGraphType
			{
				Name = schemaDescription.Id
			};
			
			foreach (var el in schemaDescription.Columns)
			{
				commonSchema.DictionaryField(new StringGraphType(), el.Name.ToLower(), el.Description);
			}

			var root = new ObjectGraphType
			{
				Name = "QueryRoot"
			};

			root.Field("commonSchema", new ListGraphType(commonSchema), resolve: ctx => {
					return new SchemaTools(client).GetListData(schemaDescription, ctx.SubFields.Keys);
				}
			);

			Query = root;
			RegisterTypes(commonSchema);
		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<SchemaTools>();
		}
	}

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
