using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Http;
using GraphQL.Validation;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SkdScheme;

namespace GraphQlServer
{
	public class GraphQLMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly GraphQLSettings _settings;
		private readonly IDocumentExecuter _executer;
		private readonly IDocumentWriter _writer;
		private readonly SchemaSelector _schemaSelector;

		public GraphQLMiddleware(
			RequestDelegate next,
			GraphQLSettings settings,
			IDocumentExecuter executer,
			IDocumentWriter writer,
			SchemaSelector schemaSelector)
		{
			_next = next;
			_settings = settings;
			_executer = executer;
			_writer = writer;
			_schemaSelector = schemaSelector;
		}

		public async Task Invoke(HttpContext context)
		{
			if (!IsGraphQLRequest(context))
			{
				await _next(context);
				return;
			}

			await ExecuteAsync(context);
		}

		private bool IsGraphQLRequest(HttpContext context)
		{
			return context.Request.Path.StartsWithSegments(_settings.Path)
					&& string.Equals(context.Request.Method, "POST", StringComparison.OrdinalIgnoreCase);
		}

		private async Task ExecuteAsync(HttpContext context)
		{
			var request = Deserialize<GraphQLRequest>(context.Request.Body);

			var result = await _executer.ExecuteAsync(_ => {
				 _.Schema = _schemaSelector.GetMatchSchema(request.SchemaName);
				_.Query = request.Query;
				_.OperationName = request.OperationName;
				_.Inputs = request.Variables.ToInputs();
				_.UserContext = _settings.BuildUserContext?.Invoke(context);
				_.ValidationRules = DocumentValidator.CoreRules();
			});

			await WriteResponseAsync(context, result);
		}

		private async Task WriteResponseAsync(HttpContext context, ExecutionResult result)
		{
			var json = _writer.Write(result);

			context.Response.ContentType = "application/json";
			context.Response.StatusCode = result.Errors?.Any() == true ? (int)HttpStatusCode.BadRequest : (int)HttpStatusCode.OK;

			await context.Response.WriteAsync(json);
		}

		public static T Deserialize<T>(Stream s)
		{
			using (var reader = new StreamReader(s))
			using (var jsonReader = new JsonTextReader(reader))
			{
				var ser = new JsonSerializer();
				return ser.Deserialize<T>(jsonReader);
			}
		}
	}
}