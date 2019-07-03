using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Common
{
	[Table("DOR")]
	public class Attachment
	{
		[Key, Column("ID")]
		public int Id { get; set; }

		[Column("ALIAS")]
		public string Alias { get; set; }
		
		[Column("KDOR")]
		public string Key { get; set; }
		
		[Column("NDOR")]
		public short Number { get; set; }
		
		[Column("FILENAME")]
		public string FileName { get; set; }
		
		[Column("FILESIZE")]
		public decimal FileSize { get; set; }
		
		[Column("FILEEXT")]
		public string FileExtension { get; set; }
		
		[Column("ISACTIVE")]
		public bool IsActive { get; set; }
		
		[Column("PR_DO")]
		public bool IsValid { get; set; }
		
		[Column("KOBJ")]
		public string ItObjectId { get; set; }
		public ItObject ItObject { get; set; }
	}
}