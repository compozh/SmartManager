using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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

		IQueryable<Resource> GetResorces(string vals);
	}

	[AddInDI(typeof(ICommonDataProvider))]
	internal class CommonDataProvider : ICommonDataProvider
	{
		protected readonly IHttpContextAccessor _httpContextAccessor;

		public CommonDataProvider(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}
		
		protected CommonDbContext DbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();

		public virtual IQueryable<Employee> Employees => DbContext.Employees;
		public virtual IQueryable<Department> Departments  => DbContext.Departments;
		public virtual IQueryable<ItObject> ItObjects  => DbContext.ItObjects;
		public virtual IQueryable<MeasurementUnit> MeasurementUnits  => DbContext.MeasurementUnits;
		public virtual IQueryable<Resource> Resources  => DbContext.Resources;
		public virtual IQueryable<ResourceGroup> ResourcesGroups => DbContext.ResourcesGroups;
		public virtual IQueryable<Document> Documents => DbContext.Documents;
		public virtual IQueryable<DocumentRow> DocumentRows => DbContext.DocumentRows;

		public IQueryable<Resource> GetResorces(string nameValue)
		{
			//var settings = new ConnectionSettings().DefaultIndex("my-index");


			//TODO POST to Elastic
			string myJson = "{\"query\": " +
								"{ \"multi_match\": " +
									"{ \"query\": \""+ nameValue + "\", " +
									"\"fields\" : [\"nmat\",\"n_res\",\"naimkm_s\"],\"fuzziness\": 100}}}";

			const string url = "http://192.168.1.74:9200/purchases_resourcename_/_search";
			var keys = new HashSet<string>();

			var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
			httpWebRequest.ContentType = "application/json";
			httpWebRequest.Method = "POST";

			using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
			{
				streamWriter.Write(myJson);
				streamWriter.Flush();
				streamWriter.Close();
			}

			var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
			using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
			{
				var result = streamReader.ReadToEnd();
				JObject o = JObject.Parse(result);
				var hits = o["hits"]["hits"];
				foreach(var item in hits)
				{
					keys.Add((string)item["_id"]);
				}


			}


			return DbContext.Resources.Where(res => keys.Contains(res.Id));
		}

	}
}