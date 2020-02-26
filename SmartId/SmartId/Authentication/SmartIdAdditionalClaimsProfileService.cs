using IdentityModel;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartId.Authentication
{
	public class IdentityWithAdditionalClaimsProfileService : IProfileService
    {
        private readonly IUserClaimsPrincipalFactory<SmartIdUser> _claimsFactory;
        private readonly UserManager<SmartIdUser> _userManager;

        public IdentityWithAdditionalClaimsProfileService(UserManager<SmartIdUser> userManager, IUserClaimsPrincipalFactory<SmartIdUser> claimsFactory)
        {
            _userManager = userManager;
            _claimsFactory = claimsFactory;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub).ConfigureAwait(false);
            var principal = await _claimsFactory.CreateAsync(user).ConfigureAwait(false);

            // клеймы, которые предоставляются автоматически, без доп. запроса
            var requestedClaimTypes = context.RequestedClaimTypes.ToList() ?? new List<string> { };
            requestedClaimTypes.AddRange(new List<string> { "email" });
            var claims = principal.Claims.ToList();
            //claims.Add(new Claim(JwtClaimTypes.Email, user.Email));

            // отфильтровать клеймы, которые требует ресурс
            claims = claims.Where(claim => requestedClaimTypes.Contains(claim.Type)).ToList();

            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(sub).ConfigureAwait(false);
            context.IsActive = user != null;
        }
    }
}
