using ItGraphQlSchema.Types.Common;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace ItGraphQlSchema.Types.Purchases
{
	public interface IPurchasesDataProvider : ICommonDataProvider
	{
		IQueryable<CartItem> CartItems { get; }
		IQueryable<Document> Applications { get; }
	}

	[AddInDI(typeof(IPurchasesDataProvider))]
	internal class PurchasesDataProvider : CommonDataProvider, IPurchasesDataProvider
	{
		private readonly IPurchasesUserSettingsProvider _userSettingsProvider;

		public PurchasesDataProvider(IHttpContextAccessor httpContextAccessor, IPurchasesUserSettingsProvider userSettingsProvider) 
			: base(httpContextAccessor)
		{
			_userSettingsProvider = userSettingsProvider;
		}

		private PurchasesUserSettings UserSettings => _userSettingsProvider.GetCurrentSettings().Result;

		public IQueryable<CartItem> CartItems => DbContext.CartItems.Where(i => i.UserId == UserSettings.UserId);

		public IQueryable<Document> Applications => DbContext.Documents.Where(i => UserSettings.ApplicationDocumentTypes.Contains(i.DocumentTypeId));
	}
}
