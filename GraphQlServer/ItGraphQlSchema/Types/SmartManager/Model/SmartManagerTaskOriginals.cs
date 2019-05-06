using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskOriginals
	{
		[JsonProperty("Id")]
		public int Id { get; set; }
		[JsonProperty("ndor")]
		public int Ndor { get; set; }
		[JsonProperty("filename")]
		public string FileName { get; set; }
		[JsonProperty("user")]
		public string User { get; set; }
		[JsonProperty("date")]
		public DateTime date { get; set; }
		[JsonProperty("ismy")]
		public bool IsMy { get; set; }
		[JsonProperty("fileext")]
		public string Fileext { get; set; }
		public string Comm { get; set; }
		public int Filesize { get; set; }
		public string Type { get; set; }
		[JsonProperty("typename")]
		public string TypeName { get; set; }
		[JsonProperty("typedescription")]
		public string TypeDescription { get; set; }
		[JsonProperty("issign")]
		public bool IsSign { get; set; }
	}
}
