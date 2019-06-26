using Nest;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[ElasticsearchType(Name = "ksm")]
	public class ElasticResource
	{
		public string Id { get; set; }

		[Text(Name = "nmat")]
		public string Name { get; set; }

		[Text(Name = "naimkm_s")]
		public string Designation { get; set; }

		[Text(Name = "n_res")]
		public string FullName { get; set; }
	}
}
