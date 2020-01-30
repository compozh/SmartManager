using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.ViewModels
{
	public class DeviceAuthorizationInputModel : ConsentInputModel
	{
		public string UserCode { get; set; }
	}

	public class DeviceAuthorizationViewModel : ConsentViewModel
	{
		public string UserCode { get; set; }
		public bool ConfirmUserCode { get; set; }
	}
}
