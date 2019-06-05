using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Http;
using GraphQL.Validation;
using ItGraphQlSchema;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

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
			if (!isGraphQlRequest(context))
			{
				await _next(context);
				return;
			}

			await executeAsync(context);
		}

		private bool isGraphQlRequest(HttpContext context)
		{
			return context.Request.Path.StartsWithSegments(_settings.Path)
					&& string.Equals(context.Request.Method, "POST", StringComparison.OrdinalIgnoreCase);
		}

		private async Task executeAsync(HttpContext context)
		{
			var anonymousСall = !context.User.Identity.IsAuthenticated;
			var request = deserialize<GraphQLRequest>(context.Request.Body);
			var schema = context.Request.Headers["schema"];
			var result = await _executer.ExecuteAsync(_ => {
				_.Schema = _schemaSelector.GetMatchSchema(request.SchemaName, anonymousСall, schema);
				_.Query = request.Query;
				_.ExposeExceptions = true;
				_.OperationName = request.OperationName;
				_.Inputs = request.Variables.ToInputs();
				_.UserContext = _settings.BuildUserContext?.Invoke(context);
				_.ValidationRules = DocumentValidator.CoreRules();
			});

			await writeResponseAsync(context, result);
		}

		private async Task writeResponseAsync(HttpContext context, ExecutionResult result)
		{
			var json = _writer.Write(result);
			
			// В случае ошибок оны выводятся в читаемом формате
			//context.Response.ContentType = "application/json";
//			if (result.Errors != null && result.Errors.Any())
//			{
//				//context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
//				await context.Response.WriteAsync(JsonConvert.SerializeObject(new {Result = result.Errors.Select(e => new {e.Code, e.Message})}));
//			}
			//context.Response.StatusCode = (int)HttpStatusCode.OK;
			await context.Response.WriteAsync(json);
		}

		private T deserialize<T>(Stream s)
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