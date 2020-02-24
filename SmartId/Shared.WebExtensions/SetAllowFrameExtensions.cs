using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Extensions
{
	public static class SetAllowFrameExtensions
	{
		public static void SetAllowFrame(this HttpContext context)
		{
			context.Items.Add("AllowFrame", true);
		}

		public static bool IsAllowFrame(this HttpContext context)
		{
			return context.Items.ContainsKey("AllowFrame") && Convert.ToBoolean(context.Items["AllowFrame"]);
		}
	}
}
