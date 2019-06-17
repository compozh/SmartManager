using System;
using Microsoft.AspNetCore.Mvc;

namespace Web.DigitalSignature
{
	public static class UrlExtensions
	{
		public static string Content(this IUrlHelper urlHelper, string contentPath, bool toAbsolute = false)
		{
			var request = urlHelper.ActionContext.HttpContext.Request;
			return new Uri(new Uri(request.Scheme + "://" + request.Host.Value), urlHelper.Content(contentPath)).ToString();
		}
	}
}