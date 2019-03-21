using GraphQL;
using GraphQL.Http;
using GraphQL.Types;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SkdScheme;

namespace GraphQlServer
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));

			services.AddSingleton<IDocumentExecuter, DocumentExecuter>();
			services.AddSingleton<IDocumentWriter, DocumentWriter>();

			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

			services.ConfigSchemas();
			services.AddSingleton<SchemaSelector>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole();

			app.UseDeveloperExceptionPage();

			app.UseMiddleware<GraphQLMiddleware>(new GraphQLSettings {
				BuildUserContext = ctx => new GraphQLUserContext {
					User = ctx.User
				}
			});

			app.UseDefaultFiles();
			app.UseStaticFiles();
		}
	}
}