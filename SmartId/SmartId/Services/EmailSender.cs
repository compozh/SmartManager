using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartId.Services
{
	/// <summary>
	/// Отправитель сообщений
	/// </summary>
	public interface IEmailSender
	{
		/// <summary>
		/// Отправить почтовое сообщение получателю
		/// </summary>
		/// <param name="recipient"></param>
		/// <param name="subject"></param>
		/// <param name="htmlMessage"></param>
		/// <returns></returns>
		Task<bool> SendEmailAsync(Recipient recipient, string subject, string htmlMessage);
	}

	/// <summary>
	/// Получатель
	/// </summary>
	public class Recipient
	{
		/// <summary>
		/// Заголовок
		/// </summary>
		public string Caption { get; set; }
		/// <summary>
		/// Почта
		/// </summary>
		public string Email { get; set; }
	}

	public class EmailSenderOptions
	{
		public string FromAdress { get; set; }
		public string FromAdressTitle { get; set; }
		public string SmtpServer { get; set; }
		public int SmtpPortNumber { get; set; }
		public string UserName { get; set; }
		public string UserPassword { get; set; }
		public string DebugCopy { get; set; }

		public string GetPassword()
		{
			var enTextBytes = Convert.FromBase64String(UserPassword);
			return Encoding.UTF8.GetString(enTextBytes);
			/*
            var simpleTextBytes = Encoding.UTF8.GetBytes(simpleText);
            string enText = Convert.ToBase64String(simpleTextBytes);
			 */
		}
	}

	/// <summary>
	/// Подключение сервиса отправки почты
	/// </summary>
	public static class EmailSenderExtentions
	{
		/// <summary>
		/// Добавить email sender
		/// </summary>
		public static void AddEmailSender(this IServiceCollection services, EmailSenderOptions options)
		{
			services.AddSingleton(options);
			services.AddTransient<IEmailSender, EmailSender>();
		}

		/// <summary>
		/// Добавить email sender
		/// </summary>
		/// <param name="services"></param>
		public static void AddEmailSender(this IServiceCollection services)
		{
			var provider = services.BuildServiceProvider();
			var configuration = provider.GetService<IConfiguration>();
			var emailSenderOptions = new EmailSenderOptions();
			configuration.Bind("EmailSettings", emailSenderOptions);
			AddEmailSender(services, emailSenderOptions);
		}
	}

	public class EmailSender: IEmailSender
	{
		private readonly ILogger<EmailSender> _logger;
		private readonly EmailSenderOptions _emailSenderOptions;
		public EmailSender(EmailSenderOptions emailSenderOptions, ILogger<EmailSender> logger)
		{
			_emailSenderOptions = emailSenderOptions;
			_logger = logger;
		}

		public Task<bool> SendEmailAsync(Recipient recipient, string subject, string htmlMessage)
		{
			if (recipient == null) throw new ArgumentNullException(nameof(recipient));
			if (_emailSenderOptions.SmtpServer == null)
			{
				_logger.LogError("SmtpServer not specified");
				return Task.FromResult(false);
			}
			using (var client = new SmtpClient())
			{
				try
				{
					client.Connect(_emailSenderOptions.SmtpServer, _emailSenderOptions.SmtpPortNumber, SecureSocketOptions.Auto);
				}
				catch (SmtpCommandException ex)
				{
					_logger.LogError($"Error trying to connect: ({ex.StatusCode}) {ex.Message}");
					return Task.FromResult(false);
				}
				catch (SmtpProtocolException ex)
				{
					_logger.LogError($"Protocol error while trying to connect: {ex.Message}");
					return Task.FromResult(false);
				}
				catch (SslHandshakeException ex)
				{
					_logger.LogError($"SSl connect exception: {ex.Message}");
					return Task.FromResult(false);
				}

				// Note: Not all SMTP servers support authentication, but GMail does.
				if (client.Capabilities.HasFlag(SmtpCapabilities.Authentication))
				{
					if (_emailSenderOptions.UserName == null)
					{
						_logger.LogError("SMTP servers support authentication, but user name not specified");
						return Task.FromResult(false);
					}
					try
					{
						client.Authenticate(_emailSenderOptions.UserName, _emailSenderOptions.GetPassword());
					}
					catch (AuthenticationException ex)
					{
						_logger.LogError($"Invalid user name or password ({_emailSenderOptions.UserName})");
						return Task.FromResult(false);
					}
					catch (SmtpCommandException ex)
					{
						_logger.LogError($"Error trying to authenticate: ({ex.StatusCode}) {ex.Message}");
						return Task.FromResult(false);
					}
					catch (SmtpProtocolException ex)
					{
						_logger.LogError($"Protocol error while trying to authenticate: {ex.Message}");
						return Task.FromResult(false);
					}
				}

				try
				{
					var message = createMessage(recipient, subject, htmlMessage, _emailSenderOptions.DebugCopy);
					client.Send(message);
					_logger.LogInformation($"Send message {message.Subject} to {string.Join(", ", message.To.Select(r => r.Name))}");
				}
				catch (SmtpCommandException ex)
				{
					var addMessage = ex.ErrorCode == SmtpErrorCode.RecipientNotAccepted ? $"Recipient not accepted: {ex.Mailbox}" :
						ex.ErrorCode == SmtpErrorCode.SenderNotAccepted ? $"Recipient not accepted: {ex.Mailbox}" : "Message not accepted";
					_logger.LogError($"Error sending message: ({ex.StatusCode}, {addMessage}) {ex.Message}");
				}
				catch (SmtpProtocolException ex)
				{
					_logger.LogError($"Protocol error while sending message: {ex.Message}");
				}

				client.Disconnect(true);
				return Task.FromResult(true);
			}
		}
		private MimeMessage createMessage(Recipient recipient, string subject, string htmlMessage, string hiddenCopy = null)
		{
			var message = new MimeMessage();
			message.From.Add(new MailboxAddress(_emailSenderOptions.FromAdressTitle, _emailSenderOptions.FromAdress));
			message.To.Add(new MailboxAddress(recipient.Caption, recipient.Email));
			message.Bcc.Add(new MailboxAddress("Hidden copy", hiddenCopy));

			message.Subject = subject;

			message.Body = new TextPart("html")
			{
				Text = htmlMessage
			};
			return message;
		}
	}
}
