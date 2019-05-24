using System.Collections.Generic;

namespace ItGraphQlSchema.Types.Purchases
{
	public class PurchasesUserSettings
	{
		public string UserId { get; set; }

		public string EmployeeNumber { get; set; }

		public List<string> ApplicationDocumentTypes { get; set; }
	}
}
