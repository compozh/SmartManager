using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Web.Data;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class OrderProvider
	{
		private IHttpContextAccessor _httpContextAccessor;
		
		private OrderDbContext _dbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<OrderDbContext>();

		public OrderProvider(SqlClient client, IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public IQueryable<Order> Orders => _dbContext.Orders;

		public IQueryable<Item> Items => _dbContext.Items;


		private T mutate<T>(MutationTypes mutation, T item, DbSet<T> set) where T : class
		{
			switch (mutation)
			{
				case MutationTypes.Add:
					_dbContext.Add(item);
					break;
				case MutationTypes.Update:
					set.Update(item);
					break;
				case MutationTypes.Delete:
					set.Remove(item);
					break;
				default:
					return null as T;
			}
			_dbContext.SaveChanges();
			return item;
		}
		
		public Item MutateItem(MutationTypes mutation, Item item)
		{
			return mutate(mutation, item, _dbContext.Items);
		}
		public Order MutateOrder(MutationTypes mutation, Order order)
		{
			return mutate(mutation, order, _dbContext.Orders);
		}
		public OrderItem MutateOrderItem(MutationTypes mutation, OrderItem orderItem)
		{
			return mutate(mutation, orderItem, _dbContext.OrderItems);
		}
		
		
		public IQueryable<OrderItem> OrderItems => _dbContext.OrderItems;


	}
	
	
	public enum MutationTypes
	{
		Add,  
		Update,
		Delete
	}
	[AtributeAddInDI]
	public class MutationTypesEnum : EnumerationGraphType<MutationTypes>
	{
	}
}
