using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
	public class SmartManagerTaskComment
	{
		public string User { get; set; }
		public DateTime Date { get; set; }
		public string Text { get; set; }
	}
}
