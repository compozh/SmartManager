using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[Table("DMZ")]
	public class Document
	{
		[Key, Column("UNDOC")]
		public int Id { get; set; }

		[Column("NDM")]
		public string Number { get; set; }

		[Column("KDMT")]
		public string DocumentTypeId { get; set; }

		[Column("DDM")]
		public DateTime? Date { get; set; }

		[Column("CEH_K")]
		public int? SenderDepartmentId { get; set; }

		[GraphTypeFK(new[] { "SenderDepartmentId" })]
		public Department SenderDepartment { get; set; }

		[Column("N_KDK_K")]
		public string SenderResponsibleId { get; set; }

		[GraphTypeFK(new[] { "SenderResponsibleId" })]
		public Employee SenderResponsible { get; set; }

		[Column("CEH_O")]
		public int? ReceiverDepartmentId { get; set; }

		[GraphTypeFK(new[] { "ReceiverDepartmentId" })]
		public Department ReceiverDepartment { get; set; }

		[Column("N_KDK_O")]
		public string ReceiverResponsibleId { get; set; }

		[GraphTypeFK(new[] { "ReceiverResponsibleId" })]
		public Employee ReceiverResponsible { get; set; }

		[Column("N_KDK_M")]
		public string MaterialResponsibleId { get; set; }

		[GraphTypeFK(new[] { "MaterialResponsibleId" })]
		public Employee MaterialResponsible { get; set; }

		[Column("COMM")]
		public string Title { get; set; }

		[GraphTypeFK(typeof(DocumentRow), "Document", new[] { "DocumentId" })]
		public ICollection<DocumentRow> Rows { get; set; }
	}
}
