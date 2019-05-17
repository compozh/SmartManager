using GraphQL.Types;
using System;
using System.Collections.Generic;
using ItGraphQlSchema.Types.SmartManager.GraphQlModel;

namespace ItGraphQlSchema.Types.SmartManager
{
	
	[AtributeAddInDI]
	public class SmartManagerTaskFullInfoGQ : ObjectGraphType<SmartManagerTaskFullInfo>
	{
		public SmartManagerTaskFullInfoGQ(SmartManagerProvider provider)
		{
			Name = "TasksGetInfo";
			Field(p => p.Name).Description("Имя");
			Field(p => p.Id).Description("Идентификатор");
			Field(p => p.Dateplan).Description("Плановая дата");
			Field(p => p.Descript);
			Field(p => p.DateAdd);
			Field(p => p.Arso);
			Field(p => p.KeyValue);
			Field(p => p.Status);
			Field(p => p.AddedFio);
			Field(p => p.AddedPhoto);
			Field(p => p.AddedId);
			Field(p => p.DateFact);
			Field(p => p.DateRemind);
			Field(p => p.IsAgree);
			Field(p => p.DocPlandate);
			Field(p => p.Priority);
			// Вложенные объекты 
			Field<ListGraphType<SmartManagerTaskOriginalGQ>>("Originals", resolve: context => context.Source.Originals);
			Field<ListGraphType<SmartManagerTaskCommentsGQ>>("Comments", resolve: context => context.Source.Comments); 
		}
	}
	public class SmartManagerTaskFullInfo
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Descript { get; set; }
		public DateTime Dateplan { get; set; }
		public DateTime DateAdd { get; set; }
		public string Status { get; set; }
		public string Arso { get; set; }
		public string KeyValue { get; set; }
		public bool IsAgree { get; set; }
		public int Priority { get; set; }
		public DateTime DateRemind { get; set; }
		public string AddedId { get; set; }
		public string AddedFio { get; set; }
		public string AddedPhoto { get; set; }
		public DateTime DateFact { get; set; }
		public DateTime DocPlandate { get; set; }
		public List <SmartManagerTaskOriginals> Originals { get; set; }
		public List<SmartManagerTaskComment> Comments { get; set; }
	}
}
