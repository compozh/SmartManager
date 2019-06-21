using System;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskParticipants
	{
		[JsonProperty("USERID")]
		public string UserId { get; set; }

		[JsonProperty("USERFIO")]
		public string UserFio { get; set; }

		[JsonProperty("NAME")]
		public string Name { get; set; }

		[JsonProperty("ROLE")]
		public string Role { get; set; }
	}
}