using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{ 
	[Table("SKM")]
	public class ResourceGroup
	{
		[Key, Column("SKM")]
		public string Id { get; set; }

		[Column("SKMNAIM")]
		public string Name { get; set; }

		[Column("SKM_PR")]
		public string ParentId { get; set; }

		public ResourceGroup Parent { get; set; }

		public List<Resource> Resources { get; set; }
		
		/// <summary>
		/// Иконка
		/// </summary>
		[Column("ICON")]
		public string Icon { get; set; }
	}
}
