using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	public class SmartManagerTaskGetinfoNestedOriginals : ObjectGraphType<SmTaskGetinfoNestedOriginals>
	{
		public SmartManagerTaskGetinfoNestedOriginals()
		{
			Name = "Originals";
			Field(p => p.FileName).Description("Имя");
			Field(p => p.Id).Description("Имя");
			Field(p => p.Comm).Description("Имя");
			Field(p => p.Fileext).Description("Имя");
			Field(p => p.IsMy).Description("Имя");
			Field(p => p.IsSign).Description("Имя");
			Field(p => p.Filesize).Description("Имя");
			Field(p => p.Ndor).Description("Имя");
			Field(p => p.Type).Description("Имя");
			Field(p => p.TypeDescription).Description("Имя");
			Field(p => p.TypeName).Description("Имя");
			Field(p => p.User).Description("Имя");
			Field(p => p.date).Description("Имя");

		}

	}

	[AtributeAddInDI]
	public class SmartManagerTaskGetinfoNestedParticipants : ObjectGraphType<SmTaskGetinfoNestedParticipants>
	{

		public SmartManagerTaskGetinfoNestedParticipants()
		{
			Name = "Participants";
			Field(p => p.UserId);
			Field(p => p.UserFio);
			Field(p => p.Role);
		}

	}

	[AtributeAddInDI]
	public class SmartManagerTaskGetinfoNestedComments : ObjectGraphType<SmTaskGetinfoNestedComments>
	{

		public SmartManagerTaskGetinfoNestedComments()
		{
			Name = "Comments";
			Field(p => p.User);
			Field(p => p.Text);
			Field(p => p.Date);
		}

	}


	[AtributeAddInDI]
	public class SmartManagerTasksGetInfo : ObjectGraphType<SmTaskGetinfo>
	{
		public SmartManagerTasksGetInfo(SmTasksProvider provider)
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

				//SmartManagerTaskGetinfoNestedOriginals a = new SmartManagerTaskGetinfoNestedOriginals();
				// вложенные объекты 
			Field<ListGraphType<SmartManagerTaskGetinfoNestedOriginals>>("Originals", resolve: context => context.Source.Originals);
			Field<ListGraphType<SmartManagerTaskGetinfoNestedParticipants>>("Participants", resolve: context => context.Source.Participants);
			Field<ListGraphType<SmartManagerTaskGetinfoNestedComments>>("Comments", resolve: context => context.Source.Comments);



		}


	}
}
