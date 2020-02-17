using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.ViewModels
{
	public class DigitalSignatureViewModel
	{
		public string SiteRoot { get; set; }
		public string Language { get; set; }
		public bool DebugMode { get; set; }
		public bool AllowStore { get; set; }
		public bool AllowStoreLocal { get; set; }
		public string InitialData { get; set; }
		public string ReturnUrl { get; set; }
		public string State { get; set; }
	}

	public class DigitalSignatureInputModel
	{
		public string SignedData { get; set; }
		public string ReturnUrl { get; set; }
		public string State { get; set; }
	}
}
