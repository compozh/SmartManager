using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Data
{
	// Add-Migration InitialCreate -Context AspIdentityDbContext -o Data/Migrations/AspIdentityDb
	// Add-Migration InitialCreate -Context PersistedGrantDbContext -o Data/Migrations/PersistedGrantDb
	// Add-Migration InitialCreate -Context ConfigurationDbContext -o Data/Migrations/ConfigurationDb
	// Update-Database
	// Remove-Migration -Context AspIdentityDbContext
	public static class SeedTools
	{
		public static IHost EnsureSeedData(this IHost host)
		{
			try
			{
				using (var scope = host.Services.CreateScope())
				{
					var configuration = scope.ServiceProvider.GetService<IConfiguration>();
					var autoSeed = configuration.GetValue<bool>("AutoSeedData");
					if (!autoSeed)
					{
						return host;
					}
					using (var context = scope.ServiceProvider.GetService<AspIdentityDbContext>())
					{
						if (context != null)
						{
							context.Database.Migrate();
						}
					}
					using (var context = scope.ServiceProvider.GetService<ConfigurationDbContext>())
					{
						if (context != null)
						{
							context.Database.Migrate();
						}
					}
					using (var context = scope.ServiceProvider.GetService<PersistedGrantDbContext>())
					{
						if (context != null)
						{
							context.Database.Migrate();
						}
					}
				}
			}
			catch (Exception ex)
			{
				throw new Exception($"Database seed error \r\n{ex.Message}");
			}
			return host;
		}
	}
}
