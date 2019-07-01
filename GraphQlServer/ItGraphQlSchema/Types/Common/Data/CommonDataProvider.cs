using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Nest;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ItGraphQlSchema.Types.Common
{
	public interface ICommonDataProvider
	{
		IQueryable<Employee> Employees { get; }
		IQueryable<Department> Departments { get; }
		IQueryable<ItObject> ItObjects { get; }
		IQueryable<MeasurementUnit> MeasurementUnits { get; }
		IQueryable<Resource> Resources { get; }
		IQueryable<ResourceGroup> ResourcesGroups { get; }
		IQueryable<Document> Documents { get; }
		IQueryable<DocumentRow> DocumentRows { get; }

		string GetResorces(string vals);
	}

	[AddInDI(typeof(ICommonDataProvider))]
	public class CommonDataProvider : ICommonDataProvider
	{
		protected readonly IHttpContextAccessor _httpContextAccessor;

		public CommonDataProvider(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}
		
		public CommonDbContext DbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();

		public virtual IQueryable<Employee> Employees => DbContext.Employees;
		public virtual IQueryable<Department> Departments  => DbContext.Departments;
		public virtual IQueryable<ItObject> ItObjects  => DbContext.ItObjects;
		public virtual IQueryable<MeasurementUnit> MeasurementUnits  => DbContext.MeasurementUnits;
		public virtual IQueryable<Resource> Resources  => DbContext.Resources;
		public virtual IQueryable<ResourceGroup> ResourcesGroups => DbContext.ResourcesGroups;
																		//.Include(f=>f.Children)
																		//.Where(w=>w.Children.Any(c=>c.ParentId == w.Id));
		public virtual IQueryable<Document> Documents => DbContext.Documents;
		public virtual IQueryable<DocumentRow> DocumentRows => DbContext.DocumentRows;

		public string GetResorces(string nameValue)
		{
			var settings = new ConnectionSettings(new System.Uri("http://192.168.1.74:9200/"))
				//.DefaultMappingFor<ElasticResource>(
				//	i=>i.IndexName("purchases_resourcename_")
				//)
				.DefaultIndex("purchases_resourcename_")
				.EnableDebugMode()
				.PrettyJson();
			var client = new ElasticClient(settings);
			var resp = client.Search<ElasticResource>(s =>s
			.From(0)
			.Size(20)
			.Query(q => q
				.MultiMatch(m => m
					.Query(nameValue)
					.Fields(f=> f
						.Field(fld => fld.Name)
						.Field(fld=>fld.FullName)
						.Field(fld=>fld.Designation))
					.Fuzziness(Fuzziness.Ratio(100))))
			.Highlight(h => h
				.PreTags("<div class=\"highlit-elastic\">")
				.PostTags("</div>")
				.Fields(
					f => f.Field(p => p.Name),
					f => f.Field(p => p.FullName),
					f => f.Field(p => p.Designation)
				)
			));
			return JsonConvert.SerializeObject(resp.Hits);
		}
	}
}