using ItGraphQlSchema.Types.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using ItGraphQlSchema.Helpers;

namespace ItGraphQlSchema.Types.Purchases
{
    public interface IPurchasesDataProvider : ICommonDataProvider
	{
		IQueryable<CartItem> CartItems { get; }
		IQueryable<Document> Applications { get; }
		PurchasesUserSettings UserSettings { get; }
	}

	[AddInDI(typeof(IPurchasesDataProvider))]
	public class PurchasesDataProvider : CommonDataProvider, IPurchasesDataProvider
	{
		private IHttpContextAccessor _httpContextAccessor;		
		private CommonDbContext _dbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();
		
		private readonly IPurchasesUserSettingsProvider _userSettingsProvider;

		public PurchasesDataProvider(IHttpContextAccessor httpContextAccessor, IPurchasesUserSettingsProvider userSettingsProvider) 
			: base(httpContextAccessor)
		{			
			_userSettingsProvider = userSettingsProvider;
			_httpContextAccessor = httpContextAccessor;
		}			

		public IQueryable<CartItem> CartItems => DbContext.CartItems.Where(i => i.UserId == UserSettings.UserId);

		public IQueryable<Document> Applications => DbContext.Documents.Where(i => UserSettings.ApplicationDocumentTypes.Contains(i.DocumentTypeId));

		public IQueryable<MeasurementUnit> MeasurementUnits => DbContext.MeasurementUnits;
		public PurchasesUserSettings UserSettings => _userSettingsProvider.GetCurrentSettings().Result;

		public override IQueryable<ResourceGroup> ResourcesGroups => DbContext.ResourcesGroups.FromSql(
			new RawSqlString($"select * from skm where {UserSettings.ResourceCondition}"));
	}
}
