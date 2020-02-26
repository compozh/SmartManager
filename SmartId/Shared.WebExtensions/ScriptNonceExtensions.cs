using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Shared.WebExtensions
{
	public static class ScriptNonceExtensions
	{
		public static IApplicationBuilder UseScriptNonce(this IApplicationBuilder app)
		{
            app.Use((context, next) =>
            {
                var rng = new RNGCryptoServiceProvider();
                var nonceBytes = new byte[32];
                rng.GetBytes(nonceBytes);
                var nonce = Convert.ToBase64String(nonceBytes);
                context.Items.Add("ScriptNonce", nonce);
                return next();
            });
            return app;
        }

        public static string GetScriptNonce(this HttpContext context)
        {
            return context.Items["ScriptNonce"].ToString();
        }
        public static IHtmlContent GetScriptNonce(this IHtmlHelper helper)
        {
            return new HtmlString(helper.ViewContext.HttpContext.GetScriptNonce());
        }
        public static void SetScryptUnsafeMode(this HttpContext context)
        {
            context.Items.Add("ScriptUnsafeMode", true);
        }

        public static bool IsScryptUnsafeMode(this HttpContext context)
        {
            return context.Items.ContainsKey("ScriptUnsafeMode") && Convert.ToBoolean(context.Items["ScriptUnsafeMode"]);
        }
    }
}
