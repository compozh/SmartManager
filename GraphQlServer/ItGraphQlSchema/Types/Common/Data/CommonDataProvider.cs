using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.Common
{
	public interface ICommonDataProvider
	{
		IQueryable<Employee> Employees { get; }
		IQueryable<Department> Departments { get; }
		IQueryable<ItObject> ItObjects { get; }
	}
	
	[AtributeAddInDI]
	internal class CommonDataProvider<T> : ICommonDataProvider where T : CommonDbContext 
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public CommonDataProvider(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}
		
		private T DbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<T>();

		public virtual IQueryable<Employee> Employees => DbContext.Employees;
		public virtual IQueryable<Department> Departments  => DbContext.Departments;
		public virtual IQueryable<ItObject> ItObjects  => DbContext.ItObjects;

	}
}