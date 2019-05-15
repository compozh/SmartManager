using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskParticipants
	{
		//[JsonProperty("userid")]
		//public int? UserId { get; set; }
		[JsonProperty("userid")]
		public string UserId { get; set; }
		[JsonProperty("userfio")]
		public string UserFio { get; set; }
		[JsonProperty("ROLE")]
		public string Role { get; set; }
	}
}
