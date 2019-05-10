using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ItGraphQlSchema.Types.SmartManager.Model;
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
			Field(p => p.Declarer);
			Field(p => p.Declarerid);
			Field(p => p.Performer);
			Field(p => p.Descript);
			Field(p => p.Performerid);
			Field(p => p.DateAdd);
			Field(p => p.Arso);
			Field(p => p.IsGenerate);
			Field(p => p.Ismy);
			Field(p => p.KeyValue);
			Field(p => p.KidCopy);
			Field(p => p.MyControl);
			Field(p => p.Needapprov);
			Field(p => p.Needcomm);
			Field(p => p.SourceGuid);
			Field(p => p.Status);
			//
			Field(p => p.AddedFio);
			Field(p => p.AddedPhoto);
			Field(p => p.AddedId);
			Field(p => p.CaseId);
			Field(p => p.DateFact);
			Field(p => p.ChildCount);
			Field(p => p.DateRemind);
			Field(p => p.ChildDoneCount);
			Field(p => p.DocCaption);
			Field(p => p.DocOrg);
			Field(p => p.DocText);
			Field(p => p.Hascomm);
			Field(p => p.DocImportant);
			Field(p => p.Hasorig);
			Field(p => p.IsAgree);
			Field(p => p.IsDocTexthtml);
			Field(p => p.DocPlandate);
			Field(p => p.DocType);
			Field(p => p.IsResponsible);
			Field(p => p.IsRead);
			Field(p => p.NextButtonText);
			Field(p => p.Role);
			Field(p => p.Priority);
			Field(p => p.PreviousButtonText);
			// вложенные объекты 
			Field<ListGraphType<SmartManagerTaskOriginalGQ>>("Originals", resolve: context => context.Source.Originals);
			Field<ListGraphType<SmartManagerTaskParticipantsGQ>>("Participants", resolve: context => context.Source.Participants);
			Field<ListGraphType<SmartManagerTaskCommentsGQ>>("Comments", resolve: context => context.Source.Comments);
		}
	}
}
