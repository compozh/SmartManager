using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Common
{
	/// <summary>
	/// Изображения
	/// </summary>
	public class Image
	{
		[Key, Column("CODE")]
		public string Id { get; set; }

		[Column("NAME")]
		public string Name { get; set; }

		[Column("EXTENTION")]
		public string Extension { get; set; }
	}
}
