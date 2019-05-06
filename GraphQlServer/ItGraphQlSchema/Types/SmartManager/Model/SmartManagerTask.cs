using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager
{
	public class SmartManagerTask
	{
		[JsonProperty("ID")]
		public int Id { get; set; }
		[JsonProperty("name")]
		public string name { get; set; }
		public string descript { get; set; }
		//[JsonProperty("Html_descript")]
		//public string htmldescript { get; set; }
		[JsonProperty("htmldescript")]
		public string HtmlDescription { get; set; }
		public string declarerid { get; set; }
		public string declarer { get; set; }
		public string declarerphoto { get; set; }
		public string performerid { get; set; }
		public string performer { get; set; }
		public DateTime dateplan { get; set; }
		public DateTime dateadd { get; set; }
		public string status { get; set; }
		public string type { get; set; }
		public bool ismy { get; set; }
		public bool mycontrol { get; set; }
		public bool isgenerate { get; set; }
		public bool needapprov { get; set; }
		public bool needcomm { get; set; }
		public string arso { get; set; }
		public string keyvalue { get; set; }
		public string kidcopy { get; set; }
		public string sourceguid { get; set; }
		public int hasorig { get; set; }
		public int hascomm { get; set; }
		public bool isagree { get; set; }
		public bool isresponsible { get; set; }
		public int childcount { get; set; }
		public int childdonecount { get; set; }
		public int priority { get; set; }
		public DateTime dateremind { get; set; }
		public string addedid { get; set; }
		[JsonProperty("addedfio")]
		public string addedFio { get; set; }
		[JsonProperty("addedphoto")]
		public string addedPhoto { get; set; }
		public DateTime datefact { get; set; }
		public int isread { get; set; }
		public int caseid { get; set; }
		public string doc_caption { get; set; }
		public string doc_text { get; set; }
		public DateTime doc_plandate { get; set; }
		public bool doc_important { get; set; }
		public bool is_doc_texthtml { get; set; }
		public string doc_type { get; set; }
		public string doc_org { get; set; }
		public string nextbuttontext { get; set; }
		public string previousbuttontext { get; set; }
		public string role { get; set; }



	}
}
