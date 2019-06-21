using System;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskComment
	{
		[JsonProperty("USERID")]
		public string UserId { get; set; }

		[JsonProperty("USER")]
		public string User { get; set; }

		[JsonProperty("DATE")]
		public DateTime Date { get; set; }

		[JsonProperty("TEXT")]
		public string Text { get; set; }

		[JsonProperty("ISAGREE")]
		public string IsAgree { get; set; }
	}
}