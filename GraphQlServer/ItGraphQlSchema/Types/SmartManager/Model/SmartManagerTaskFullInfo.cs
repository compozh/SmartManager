using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
    public class SmartManagerTaskFullInfo
    {
        [JsonProperty("ID")]
		public int Id { get; set; }

		[JsonProperty("NAME")]
		public string Name { get; set; }

		[JsonProperty("DESCRIPT")]
		public string Descript { get; set; }

		[JsonProperty("HTMLDESCRIPT")]
		public string HtmlDescript { get; set; }

		[JsonProperty("DECLARERID")]
		public string DeclarerId { get; set; }

		[JsonProperty("DECLARER")]
		public string Declarer { get; set; }

		[JsonProperty("DECLARERPHOTO")]
		public string DeclarerPhoto { get; set; }

		[JsonProperty("PERFORMERID")]
		public string PerformerId { get; set; }

		[JsonProperty("PERFORMER")]
		public string Performer { get; set; }

		[JsonProperty("DATEPLAN")]
		public DateTime Dateplan { get; set; }

		[JsonProperty("DATEADD")]
		public DateTime DateAdd { get; set; }

		[JsonProperty("STATUS")]
		public string Status { get; set; }

		[JsonProperty("ISMY")]
		public bool IsMy { get; set; }

		[JsonProperty("MYCONTROL")]
		public bool MyControl { get; set; }

		[JsonProperty("ISGENERATE")]
		public bool IsGenerate { get; set; }

		[JsonProperty("NEEDAPPROV")]
		public bool NeedApprov { get; set; }

		[JsonProperty("NEEDCOMM")]
		public bool NeedComm { get; set; }

		[JsonProperty("ARSO")]
		public string Arso { get; set; }

		[JsonProperty("KEYVALUE")]
		public string KeyValue { get; set; }

		[JsonProperty("KIDCOPY")]
		public string KidCopy { get; set; }

		[JsonProperty("HASORIG")]
		public int HasOrig { get; set; }

		[JsonProperty("HASCOMM")]
		public int HasComm { get; set; }

		[JsonProperty("ISAGREE")]
		public bool IsAgree { get; set; }

		[JsonProperty("ISRESPONSIBLE")]
		public bool IsResponsible { get; set; }

		[JsonProperty("CHILDCOUNT")]
		public int ChildCount { get; set; }

		[JsonProperty("CHILDDONECOUNT")]
		public int ChildDoneCount { get; set; }

		[JsonProperty("PRIORITY")]
		public int Priority { get; set; }

		[JsonProperty("DATEREMIND")]
		public DateTime DateRemind { get; set; }

		[JsonProperty("ADDEDID")]
		public string AddedId { get; set; }

		[JsonProperty("ADDEDFIO")]
		public string AddedFio { get; set; }

		[JsonProperty("ADDEDPHOTO")]
		public string AddedPhoto { get; set; }

		[JsonProperty("DATEFACT")]
		public DateTime DateFact { get; set; }

		[JsonProperty("ISREAD")]
		public int IsRead { get; set; }

		[JsonProperty("CASEID")]
		public int CaseId { get; set; }

		[JsonProperty("DOC_CAPTION")]
		public string DocCaption { get; set; }
		
		[JsonProperty("ORIGINALS")]
        public List <SmartManagerTaskOriginals> Originals { get; set; }
		
		[JsonProperty("COMMENTS")]
        public List<SmartManagerTaskComment> Comments { get; set; }
		
		[JsonProperty("CHILDTASKS")]
        public List<SmartManagerTaskFullInfo> ChildTasks { get; set; }
		
		[JsonProperty("PARTICIPANTS")]
        public List<SmartManagerTaskParticipants> Participants { get; set; }
    }
}
