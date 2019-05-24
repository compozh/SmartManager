using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

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
	}
}