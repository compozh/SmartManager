// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityModel;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Quickstart.UI;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using SmartId.Extensions;
using SmartId.Models;
using SmartId.Services;
using SmartId.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SmartId.Controllers
{
	[SecurityHeaders]
	[AllowAnonymous]
	public class AccountController : Controller
	{
		private readonly UserManager<SmartIdUser> _userManager;
		private readonly SignInManager<SmartIdUser> _signInManager;
		private readonly IIdentityServerInteractionService _interaction;
		private readonly IClientStore _clientStore;
		private readonly IAuthenticationSchemeProvider _schemeProvider;
		private readonly IEventService _events;
		private readonly ILogger<AccountController> _logger;
		private readonly IHtmlTemplateExecutor _htmlTemplateExecutor;
		private readonly IEmailSender _emailSender;

		public AccountController(
			UserManager<SmartIdUser> userManager,
			SignInManager<SmartIdUser> signInManager,
			IIdentityServerInteractionService interaction,
			IClientStore clientStore,
			IAuthenticationSchemeProvider schemeProvider,
			IEventService events,
			ILogger<AccountController> logger,
			IHtmlTemplateExecutor htmlTemplateExecutor,
			IEmailSender emailSender)
		{
			_userManager = userManager;
			_signInManager = signInManager;
			_interaction = interaction;
			_clientStore = clientStore;
			_schemeProvider = schemeProvider;
			_events = events;
			_logger = logger;
			_htmlTemplateExecutor = htmlTemplateExecutor;
			_emailSender = emailSender;
		}

#region login

		/// <summary>
		/// Entry point into the login workflow
		/// </summary>
		[HttpGet]
		public async Task<IActionResult> Login(string returnUrl)
		{
			// build a model so we know what to show on the login page
			var vm = await buildLoginViewModelAsync(returnUrl).ConfigureAwait(false);

			if (vm.IsExternalLoginOnly)
			{
				// we only have one option for logging in and it's an external provider
				return RedirectToAction("Challenge", "External", new { provider = vm.ExternalLoginScheme, returnUrl });
			}

			return View(vm);
		}

		/// <summary>
		/// Handle postback from username/password login
		/// </summary>
		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Login(LoginInputModel model, string button)
		{
			if (model == null) throw new ArgumentNullException(nameof(model));
			// получаем контекст запроса на авторизацию
			var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl).ConfigureAwait(false);

			// если пользователь нажал на "отменить"
			if (button != "login")
			{
				if (context != null)
				{
					// если пользователь отменил вход, отправляем ответ, аналогичный отмене согласия. Это вернет клиенту ответ об ошибке OIDS "отказано в доступе"
					await _interaction.GrantConsentAsync(context, ConsentResponse.Denied).ConfigureAwait(false);

					// мы можем доверять model.ReturnUrl, поскольку GetAuthorizationContextAsync вернул ненулевое значение
					if (await _clientStore.IsPkceClientAsync(context.ClientId).ConfigureAwait(false))
					{
						// если клиент использует PKCE, то мы предполагаем, что это нативный клиент.
						// отображаем окно "вы можете вернуться" для позитивного UX пользователя.
						return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
					}

					return Redirect(model.ReturnUrl);
				}
				else
				{
					// поскольку у нас нет действительного контекста, мы просто возвращаемся на домашнюю страницу
					return Redirect("~/");
				}
			}

			if (ModelState.IsValid)
			{
				var user = await _userManager.FindByNameAsync(model.Username).ConfigureAwait(false);

				// TODO: testit
				// проверяем подтвержден ли пользователь. Проверяем только если пользователь ввел корректный пароль
				if (user != null && await _userManager.CheckPasswordAsync(user, model.Password).ConfigureAwait(false))
				{
					if (!await _signInManager.CanSignInAsync(user).ConfigureAwait(false))
					{
						await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "You must have a confirmed email to log on", clientId: context?.ClientId)).ConfigureAwait(false);
						ModelState.AddModelError(string.Empty, "email not confirmed");
						var vme = await buildLoginViewModelAsync(model).ConfigureAwait(false);
						return View("Login", vme);
					}
				}
				
				var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberLogin, lockoutOnFailure: true).ConfigureAwait(false);
				if (result.Succeeded)
				{
					await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: context?.ClientId)).ConfigureAwait(false);

					if (context != null)
					{
						if (await _clientStore.IsPkceClientAsync(context.ClientId).ConfigureAwait(false))
						{
							// если клиент использует PKCE, то мы предполагаем, что это нативный клиент.
							// отображаем окно "вы можете вернуться" для позитивного UX пользователя.
							return View("Redirect", new RedirectViewModel { RedirectUrl = model.ReturnUrl });
						}

						// мы можем доверять model.ReturnUrl, поскольку GetAuthorizationContextAsync вернул ненулевое значение
						return Redirect(model.ReturnUrl);
					}

					// request for a local page
					if (Url.IsLocalUrl(model.ReturnUrl))
					{
						return Redirect(model.ReturnUrl);
					}
					else if (string.IsNullOrEmpty(model.ReturnUrl))
					{
						return Redirect("~/");
					}
					else
					{
						// user might have clicked on a malicious link - should be logged
						throw new Exception("invalid return URL");
					}
				}

				await _events.RaiseAsync(new UserLoginFailureEvent(model.Username, "invalid credentials", clientId: context?.ClientId)).ConfigureAwait(false);
				ModelState.AddModelError(string.Empty, AccountOptions.InvalidCredentialsErrorMessage);
			}

			// something went wrong, show form with error
			var vm = await buildLoginViewModelAsync(model).ConfigureAwait(false);
			return View("Login", vm);
		}

#endregion login

#region logout

		/// <summary>
		/// Show logout page
		/// </summary>
		[HttpGet]
		public async Task<IActionResult> Logout(string logoutId)
		{
			// build a model so the logout page knows what to display
			var vm = await buildLogoutViewModelAsync(logoutId);

			if (vm.ShowLogoutPrompt == false)
			{
				// if the request for logout was properly authenticated from IdentityServer, then
				// we don't need to show the prompt and can just log the user out directly.
				return await Logout(vm);
			}

			return View(vm);
		}

		/// <summary>
		/// Handle logout page postback
		/// </summary>
		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Logout(LogoutInputModel model)
		{
			// build a model so the logged out page knows what to display
			var vm = await buildLoggedOutViewModelAsync(model.LogoutId);

			if (User?.Identity.IsAuthenticated == true)
			{
				// delete local authentication cookie
				await _signInManager.SignOutAsync();

				// raise the logout event
				await _events.RaiseAsync(new UserLogoutSuccessEvent(User.GetSubjectId(), User.GetDisplayName()));
			}

			// check if we need to trigger sign-out at an upstream identity provider
			if (vm.TriggerExternalSignout)
			{
				// build a return URL so the upstream provider will redirect back
				// to us after the user has logged out. this allows us to then
				// complete our single sign-out processing.
				string url = Url.Action("Logout", new { logoutId = vm.LogoutId });

				// this triggers a redirect to the external provider for sign-out
				return SignOut(new AuthenticationProperties { RedirectUri = url }, vm.ExternalAuthenticationScheme);
			}

			return View("LoggedOut", vm);
		}

		#endregion logout

#region register

		/// <summary>
		/// Регистрация
		/// </summary>
		[HttpGet]
		public async Task<IActionResult> RegisterAsync(string returnUrl = null)
		{
			var vm = await buildRegisterViewModelAsync(returnUrl).ConfigureAwait(false);
			return View(vm);
		}

		/// <summary>
		/// Регистрация
		/// </summary>
		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> RegisterAsync(RegisterInputModel model, string button)
		{
			if (ModelState.IsValid)
			{
				var user = new SmartIdUser { UserName = model.Email, Email = model.Email };
				var result = await _userManager.CreateAsync(user, model.Password).ConfigureAwait(false);
				if (result.Succeeded)
				{
					_logger.LogInformation($"User {model.Email} created a new account with password.");

					var code = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);
					code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
					var returnUrl = HtmlEncoder.Default.Encode(Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, Request.Scheme));

					var templateName = "ConfirmEmail";
					var mailBody = _htmlTemplateExecutor.GetContent(templateName, new { ReturnUrl = returnUrl, model.Email });
					if (mailBody == null)
					{
						ModelState.AddModelError(string.Empty, "Сервис временно не доступен. Попробуйте позже");
						_logger.LogError($"Ошибка регистрации. Пользоваателю {model.Email} не отправлено письмо подтверждения email. Ошибка формирования шаблона {templateName}");
						var vme1 = await buildRegisterViewModelAsync(model.ReturnUrl, model.Email).ConfigureAwait(false);
						return View(vme1);
					}

					var sendResult = await _emailSender.SendEmailAsync(new Recipient { Caption = model.Email, Email = model.Email }, "Подтверждение регистрации", mailBody).ConfigureAwait(false);
					if (!sendResult)
					{
						ModelState.AddModelError(string.Empty, "Сервис временно не доступен. Попробуйте позже");
						_logger.LogError($"Ошибка регистрации. Пользоваателю {model.Email} не отправлено письмо подтверждения email");
						var vme1 = await buildRegisterViewModelAsync(model.ReturnUrl, model.Email).ConfigureAwait(false);
						return View(vme1);
					}

					if (_userManager.Options.SignIn.RequireConfirmedAccount)
					{
						return View("RegisterConfirmation", new ConfirmEmailViewModel { Email = model.Email });
					}
					else
					{
						return await Login(new LoginInputModel { Password = model.Password, Username = model.Email, ReturnUrl = model.ReturnUrl }, "login").ConfigureAwait(false);
					}
				}
				foreach (var error in result.Errors)
				{
					ModelState.AddModelError(string.Empty, error.Description);
				}
			}
			var vm = await buildRegisterViewModelAsync(model.ReturnUrl, model.Email).ConfigureAwait(false);
			return View(vm);
		}

		/// <summary>
		/// Подтверждение почты
		/// </summary>
		[HttpGet]
		public async Task<IActionResult> ConfirmEmailAsync(string userId, string code)
		{
			if (userId == null || code == null)
			{
				return RedirectToPage("~/");
			}

			var user = await _userManager.FindByIdAsync(userId).ConfigureAwait(false);
			if (user == null)
			{
				return NotFound($"Unable to load user with ID '{userId}'.");
			}

			code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
			var result = await _userManager.ConfirmEmailAsync(user, code).ConfigureAwait(false);
			// TODO: Добавлять пользователя в СУС

			return View(new StatusMessageViewModel { StatusMessage = result.Succeeded ? "Thank you for confirming your email." : "Error confirming your email." });
		}

		#endregion register

		[HttpGet]
		public IActionResult AccessDenied()
		{
			return View();
		}

#region helpers

		/*****************************************/
		/* helper APIs for the AccountController */
		/*****************************************/
		private async Task<LoginViewModel> buildLoginViewModelAsync(string returnUrl)
		{
			var context = await _interaction.GetAuthorizationContextAsync(returnUrl).ConfigureAwait(false);
			if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP).ConfigureAwait(false) != null)
			{
				var local = context.IdP == IdentityServer4.IdentityServerConstants.LocalIdentityProvider;

				// this is meant to short circuit the UI and only trigger the one external IdP
				var vm = new LoginViewModel
				{
					EnableLocalLogin = local,
					ReturnUrl = returnUrl,
					Username = context?.LoginHint,
				};

				if (!local)
				{
					vm.ExternalProviders = new[] { new ExternalProvider { AuthenticationScheme = context.IdP } };
				}

				return vm;
			}

			var providers = await getExternalProviderListAsync().ConfigureAwait(false);

			var allowLocal = true;
			if (context?.ClientId != null)
			{
				var client = await _clientStore.FindEnabledClientByIdAsync(context.ClientId).ConfigureAwait(false);
				if (client != null)
				{
					allowLocal = client.EnableLocalLogin;

					if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
					{
						providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
					}
				}
			}

			return new LoginViewModel
			{
				AllowRememberLogin = AccountOptions.AllowRememberLogin,
				EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
				ReturnUrl = returnUrl,
				Username = context?.LoginHint,
				ExternalProviders = providers.ToArray()
			};
		}

		private async Task<LoginViewModel> buildLoginViewModelAsync(LoginInputModel model)
		{
			var vm = await buildLoginViewModelAsync(model.ReturnUrl);
			vm.Username = model.Username;
			vm.RememberLogin = model.RememberLogin;
			return vm;
		}

		private async Task<LogoutViewModel> buildLogoutViewModelAsync(string logoutId)
		{
			var vm = new LogoutViewModel { LogoutId = logoutId, ShowLogoutPrompt = AccountOptions.ShowLogoutPrompt };

			if (User?.Identity.IsAuthenticated != true)
			{
				// if the user is not authenticated, then just show logged out page
				vm.ShowLogoutPrompt = false;
				return vm;
			}

			var context = await _interaction.GetLogoutContextAsync(logoutId);
			if (context?.ShowSignoutPrompt == false)
			{
				// it's safe to automatically sign-out
				vm.ShowLogoutPrompt = false;
				return vm;
			}

			// show the logout prompt. this prevents attacks where the user
			// is automatically signed out by another malicious web page.
			return vm;
		}

		private async Task<LoggedOutViewModel> buildLoggedOutViewModelAsync(string logoutId)
		{
			// get context information (client name, post logout redirect URI and iframe for federated signout)
			var logout = await _interaction.GetLogoutContextAsync(logoutId);

			var vm = new LoggedOutViewModel
			{
				AutomaticRedirectAfterSignOut = AccountOptions.AutomaticRedirectAfterSignOut,
				PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
				ClientName = string.IsNullOrEmpty(logout?.ClientName) ? logout?.ClientId : logout?.ClientName,
				SignOutIframeUrl = logout?.SignOutIFrameUrl,
				LogoutId = logoutId
			};

			if (User?.Identity.IsAuthenticated == true)
			{
				var idp = User.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
				if (idp != null && idp != IdentityServer4.IdentityServerConstants.LocalIdentityProvider)
				{
					var providerSupportsSignout = await HttpContext.GetSchemeSupportsSignOutAsync(idp);
					if (providerSupportsSignout)
					{
						if (vm.LogoutId == null)
						{
							// if there's no current logout context, we need to create one
							// this captures necessary info from the current logged in user
							// before we signout and redirect away to the external IdP for signout
							vm.LogoutId = await _interaction.CreateLogoutContextAsync();
						}

						vm.ExternalAuthenticationScheme = idp;
					}
				}
			}

			return vm;
		}

		private async Task<RegisterViewModel> buildRegisterViewModelAsync(string returnUrl, string email = null)
		{
			var externalProviders = await getExternalProviderListAsync().ConfigureAwait(false);

			return new RegisterViewModel
			{
				ReturnUrl = returnUrl,
				ExternalProviders = externalProviders,
				Email = email
			};
		}

		private async Task<List<ExternalProvider>> getExternalProviderListAsync()
		{
			var schemes = await _schemeProvider.GetAllSchemesAsync().ConfigureAwait(false);
			return schemes
				.Where(x => x.DisplayName != null ||
							(x.Name.Equals(AccountOptions.WindowsAuthenticationSchemeName, StringComparison.OrdinalIgnoreCase))
				)
				.Select(x => new ExternalProvider
				{
					DisplayName = x.DisplayName,
					AuthenticationScheme = x.Name
				}).ToList();
		}

		#endregion helpers

	}
}