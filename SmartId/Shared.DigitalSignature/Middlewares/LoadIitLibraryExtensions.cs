using Microsoft.Extensions.Hosting;
using MobileIdProxy.Helpers;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Middlewares
{
	public static class LoadIitLibraryExtensions
	{
		public static IHostBuilder LoadIitLibrary(this IHostBuilder builder)
		{
			IitHelper.Init();
			return builder;
		}
	}

}
