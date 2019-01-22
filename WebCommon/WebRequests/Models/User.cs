using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.WebRequests.Models
{
	public class User
	{

		public bool Success { get; set; }


		public string Id { get; set; }


		public string UserName { get; set; }


		public string Ticket { get; set; }


		public string FailReason { get; set; }


		public string NeedChangePassword { get; set; }


		public string TempPasswordRequired { get; set; }


		public string TempPasswordMessage { get; set; }

	}
}
