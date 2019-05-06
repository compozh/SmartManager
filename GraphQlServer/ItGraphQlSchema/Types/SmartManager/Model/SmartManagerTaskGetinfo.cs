using GraphQL.Types;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager
{
	public class SmartManagerTaskGetinfo
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Descript { get; set; }
		public string Declarer { get; set; }
		public string Declarerid { get; set; }
		public string Performer { get; set; }
		public string Performerid { get; set; }
		public DateTime Dateplan { get; set; }
		[JsonProperty("Dateadd")]
		public DateTime DateAdd { get; set; }
		public string Status { get; set; }
		public bool Ismy { get; set; }
		[JsonProperty("Mycontrol")]
		public bool MyControl { get; set; }
		[JsonProperty("Isgenerate")]
		public bool IsGenerate { get; set; }
		public bool Needapprov { get; set; }
		public bool Needcomm { get; set; }
		public string Arso { get; set; }
		[JsonProperty("Keyvalue")]
		public int KeyValue { get; set; }
		[JsonProperty("KIDCOPY")]
		public string KidCopy { get; set; }
		[JsonProperty("SOURCEGUID")]
		public string SourceGuid { get; set; }
		public int Hasorig { get; set; }
		public int Hascomm { get; set; }
		[JsonProperty("Isagree")]
		public bool IsAgree { get; set; }
		[JsonProperty("Isresponsible")]
		public bool IsResponsible { get; set; }
		[JsonProperty("Childcount")]
		public int ChildCount { get; set; }
		[JsonProperty("Childdonecount")]
		public int ChildDoneCount { get; set; }
		public int Priority { get; set; }
		[JsonProperty("Dateremind")]
		public DateTime DateRemind { get; set; }
		[JsonProperty("addedid")]
		public string AddedId { get; set; }
		[JsonProperty("ADDEDFIO")]
		public string AddedFio { get; set; }
		[JsonProperty("addedphoto")]
		public string AddedPhoto { get; set; }
		[JsonProperty("Datefact")]
		public DateTime DateFact { get; set; }
		[JsonProperty("Isread")]
		public int IsRead { get; set; }
		[JsonProperty("Caseid")]
		public int CaseId { get; set; }
		[JsonProperty("doc_caption")]
		public string DocCaption { get; set; }
		[JsonProperty("doc_text")]
		public string DocText { get; set; }
		[JsonProperty("doc_plandate")]
		public DateTime DocPlandate { get; set; }
		[JsonProperty("DOC_IMPORTANT")]
		public bool DocImportant { get; set; }
		[JsonProperty("is_doc_texthtml")]
		public bool IsDocTexthtml { get; set; }
		[JsonProperty("doc_type")]
		public string DocType { get; set; }
		[JsonProperty("doc_org")]
		public string DocOrg { get; set; }
		[JsonProperty("nextbuttontext")]
		public string NextButtonText { get; set; }
		[JsonProperty("PREVIOUSBUTTONTEXT")]
		public string PreviousButtonText { get; set; }
		public string Role { get; set; }
		public List<SmartManagerTaskParticipants> Participants { get; set; }
		[JsonProperty("doc_responsibletext")]
		public string DocResponsibleText { get; set; }
		[JsonProperty("Originals")]
		public List <SmartManagerTaskOriginals> Originals { get; set; }
		[JsonProperty("comments")]
		public List<SmartManagerTaskComments> Comments { get; set; }
		//[JsonProperty("tasks")]
		//public string Tasks { get; set; }
	}

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

	public class SmartManagerTaskOriginals
	{
		[JsonProperty("Id")]
		public int  Id { get; set; }
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

	public class SmartManagerTaskComments
	{
		public string User { get; set; }
		public DateTime Date { get; set; }
		public string Text { get; set; }
	}
}
