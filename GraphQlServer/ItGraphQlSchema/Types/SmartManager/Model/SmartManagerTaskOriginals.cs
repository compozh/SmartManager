using System;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskOriginals
	{
		[JsonProperty("ID")]
		public int Id { get; set; }

		[JsonProperty("NDOR")]
		public int Ndor { get; set; }

		[JsonProperty("FILENAME")]
		public string FileName { get; set; }

		[JsonProperty("USER")]
		public string User { get; set; }

		[JsonProperty("DATE")]
		public DateTime Date { get; set; }

		[JsonProperty("ISMY")]
		public bool IsMy { get; set; }

		[JsonProperty("FILEEXT")]
		public string FileExt { get; set; }

		[JsonProperty("COMM")]
		public string Comm { get; set; }

		[JsonProperty("FILESIZE")]
		public int FileSize { get; set; }

		[JsonProperty("TYPE")]
		public string Type { get; set; }

		[JsonProperty("TYPENAME")]
		public string TypeName { get; set; }

		[JsonProperty("TYPEDESCRIPTION")]
		public string TypeDescription { get; set; }

		[JsonProperty("ISSIGN")]
		public bool IsSign { get; set; }

		public string File { get; set; }
	}
}