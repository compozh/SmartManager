using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Shared.DigitalSignature.Authentication
{
	public class QesdAuthenticationHandler : RemoteAuthenticationHandler<QesdAuthenticationOptions>
	{
        protected HtmlEncoder HtmlEncoder { get; }
        protected DigitalSignature DigitalSignature { get; }
        public QesdAuthenticationHandler(IOptionsMonitor<QesdAuthenticationOptions> options, ILoggerFactory logger, HtmlEncoder htmlEncoder, UrlEncoder encoder, ISystemClock clock, DigitalSignature digitalSignature)
            : base(options, logger, encoder, clock)
        {
            HtmlEncoder = htmlEncoder;
            DigitalSignature = digitalSignature;
        }

        private const string signCookie = ".ExternalAuthentication.QESDUA_AP";

        protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
        {

            if (string.IsNullOrEmpty(properties.RedirectUri))
            {
                properties.RedirectUri = OriginalPathBase + OriginalPath + Request.QueryString;
            }

            // OAuth2 10.12 CSRF
            GenerateCorrelationId(properties);
            var data = Guid.NewGuid().ToString();
            writeSignCookie(data);
            var redirectUri = OriginalPathBase + Options.CallbackPath;
            var state = Options.StateDataFormat.Protect(properties);
            var parameters = new Dictionary<string, string>
            {
                { "returnUrl", redirectUri },
                { "data", data },
                { "state", state }
            };
            var authorizationEndpoint = Options.AuthorizationEndpointBuilder == null ? QueryHelpers.AddQueryString(Options.AuthorizationEndpoint, parameters):
                Options.AuthorizationEndpointBuilder(Options.AuthorizationEndpoint, parameters);
            var redirectContext = new RedirectContext<QesdAuthenticationOptions>(
                Context, Scheme, Options,
                properties, authorizationEndpoint
                );
            redirectContext.Response.Redirect(redirectContext.RedirectUri);
        }

        private void writeSignCookie(string nonce)
        {
            if (string.IsNullOrEmpty(nonce))
            {
                throw new ArgumentNullException(nameof(nonce));
            }

            var cookieOptions = new CookieOptions() { 
                Secure = true,
                Expires = Clock.UtcNow.Add(TimeSpan.FromMinutes(Options.SignQueryLifetime)),
                IsEssential = true
            };
            Response.Cookies.Append(signCookie, nonce, cookieOptions);
        }
        private string readSignCookie()
        {
            var result = Request.Cookies[signCookie];
            var cookieOptions = new CookieOptions() { Secure = true };
            Response.Cookies.Delete(signCookie, cookieOptions);
            return result;
        }
        
        protected override async Task<HandleRequestResult> HandleRemoteAuthenticateAsync()
        {
            if (string.Equals(Request.Method, "GET", StringComparison.OrdinalIgnoreCase) || !Request.Form.ContainsKey("SignedData") || !Request.Form.ContainsKey("State"))
            {
                return HandleRequestResult.Fail("Failed to retrieve signed.");
            }
            var state = Request.Form["State"].ToString();
            var properties = Options.StateDataFormat.Unprotect(state);
            if (properties == null)
            {
                return HandleRequestResult.Fail("The oauth state was missing or invalid.");
            }
            properties.Items.Add("SignedData", Request.Form["SignedData"].ToString());
            if (!ValidateCorrelationId(properties))
            {
                return HandleRequestResult.Fail("Correlation failed.", properties);
            }
            var data = readSignCookie();
            if (string.IsNullOrWhiteSpace(data))
            {
                return HandleRequestResult.Fail("Sign query lifetime expiried.", properties);
            }
            var result = DigitalSignature.VerifyDataSignature(data, properties.Items["SignedData"]);
            if (!result.Success)
            {
                return HandleRequestResult.Fail("Verify failed. " + result.FailReason, properties);
            }

            var claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier, result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.Serial)),
                new Claim(/*JwtClaimTypes.Subject*/"sub", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.Serial)),
                new Claim(ClaimTypes.Name, result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjFullName)),
                new Claim(ClaimTypes.Email, result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjEMail)),
                new Claim(ClaimTypes.MobilePhone, result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjPhone)),
                // issuer Реквізити видавника сертифіката(ЦСК)
                new Claim("issuer", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.Issuer)),
                // issuercn Загальне ім’я ЦСК
                new Claim("issuercn", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.IssuerCN)),
                // serial Реєстраційний номер сертифіката у ЦСК
                new Claim("serial", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.Serial)),
                // subject Реквізити власника сертифіката(користувача)
                new Claim("subject", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.Subject)),
                // subjectcn Загальне ім’я користувача
                new Claim("subjectcn", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjCN)),
                // locality Місто(населений пункт) користувача
                new Claim("locality", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjLocality)),
                // state Область(регіон) користувача
                new Claim("state", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjState)),
                // o Найменування організації користувача
                new Claim("o", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjOrg)),
                // ou Назва підрозділу організації користувача
                new Claim("ou", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjOrgUnit)),
                // title Посада користувача
                new Claim("title", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjTitle)),
                // givenname Ім’я користувача
                //new Claim("givenname", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.)),
                // middlename По батькові користувача
                //new Claim("middlename", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.)),
                // lastname Прізвище користувача
                //new Claim("lastname", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.)),
                // address Адреса(фізична) користувача
                new Claim("address", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjAddress)),
                // phone Телефон користувача
                new Claim("phone", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjPhone)),
                // dns DNS-ім'я користувача
                new Claim("DNS", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjDNS)),
                // edrpoucode Код ЄДРПОУ користувача
                new Claim("edrpoucode", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjEDRPOUCode)),
                // drfocode Код ДРФО користувача
                new Claim("drfocode", result.GetSignerKeyInfo(Shared.DigitalSignature.Models.InfoTypes.SubjDRFOCode))
            };

            ClaimsIdentity identity = new ClaimsIdentity(claims, Scheme.Name, ClaimTypes.Name, ClaimsIdentity.DefaultRoleClaimType);
            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), properties, Scheme.Name);

            if (ticket != null)
            {
                return HandleRequestResult.Success(ticket);
            }
            else
            {
                return HandleRequestResult.Fail("Failed to retrieve user information from remote server.", properties);
            }
        }
    }
}
