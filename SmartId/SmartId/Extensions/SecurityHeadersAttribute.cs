// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Shared.WebExtensions;
using SmartId.Extensions;
using System;
using System.Security.Cryptography;

namespace IdentityServer4.Quickstart.UI
{
	public class SecurityHeadersAttribute : ActionFilterAttribute
	{
		public override void OnResultExecuting(ResultExecutingContext context)
		{
			var result = context.Result;
			if (result is ViewResult)
			{
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
				if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Type-Options"))
				{
					context.HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
				}

				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
				if (!context.HttpContext.Response.Headers.ContainsKey("X-Frame-Options"))
				{
					context.HttpContext.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
				}

				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
				var csp = "default-src 'self'; object-src 'none'; sandbox allow-forms allow-same-origin allow-scripts; base-uri 'self';";
				csp += "upgrade-insecure-requests;";
				// Указать источники картинок
				csp += "img-src 'self' data:;";
				// Фонты от гугля
				csp += "style-src 'self' https://fonts.googleapis.com;";
				csp += "font-src 'self' https://fonts.gstatic.com;";
				// скрипты
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
				var unsafeRules = context.HttpContext.IsScryptUnsafeMode() ? " 'unsafe-eval'" : string.Empty;
				csp += $"script-src 'self' 'nonce-{context.HttpContext.GetScriptNonce()}' 'unsafe-inline'{unsafeRules};";
				// фреймы
				csp += context.HttpContext.IsAllowFrame() ? "frame-ancestors 'self';" : "frame-ancestors 'none';";

				// once for standards compliant browsers
				if (!context.HttpContext.Response.Headers.ContainsKey("Content-Security-Policy"))
				{
					context.HttpContext.Response.Headers.Add("Content-Security-Policy", csp);
				}
				// and once again for IE
				if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Security-Policy"))
				{
					context.HttpContext.Response.Headers.Add("X-Content-Security-Policy", csp);
				}

				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
				var referrer_policy = "no-referrer";
				if (!context.HttpContext.Response.Headers.ContainsKey("Referrer-Policy"))
				{
					context.HttpContext.Response.Headers.Add("Referrer-Policy", referrer_policy);
				}
			}
		}
	}
}
