using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ItGraphQlSchema.Helpers;
using ItGraphQlSchema.Types.Purchases;
using ItGraphQlSchema.Types.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.Services
{

    [AddInDI(typeof(IPurchasesService))]
    public class PurchasesService : IPurchasesService
    {
        private IHttpContextAccessor _httpContextAccessor;
        public PurchasesUserSettings UserSettings;
        private CommonDbContext _dbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();//(CommonDbContext)_httpContextAccessor.HttpContext.RequestServices.GetService(typeof(CommonDbContext));
        private readonly IMapper _mapper;
        
        public PurchasesService(IPurchasesUserSettingsProvider userSettingsProvider, IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                _mapper = httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IMapper>();
                _httpContextAccessor = httpContextAccessor;
                var temp = userSettingsProvider.GetCurrentSettings();
                UserSettings = userSettingsProvider.GetCurrentSettings().Result;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
        }
        public CustomResult CreateCart(CartItem item)
        {
            try
            {
                var result = new CustomResult();
                if (item.DateDelivery < System.DateTime.Now)
                {
                    result.Message.Add("Date is lesser than now.");
                    result.Successed = false;
                }
                if (_dbContext.MeasurementUnits.FirstOrDefault(x => x.Id == item.MeasurementUnitId) == null)
                {
                    result.Message.Add("There is no units.");
                    result.Successed = false;
                }

                if (result.Successed)
                {
                    item.UserId = UserSettings.UserId;
                    item.SignatureDate = DateTime.Now;
                    item.SignatureUserId = UserSettings.UserId;

                    _dbContext.CartItems.Add(item);
                    _dbContext.SaveChanges();

					result.Message.Add("Cart item was added.");
					result.ReturnValue = item;
                }

                return result;
            }
            catch (System.Exception ex)
            {
                return new CustomResult { Message = new List<string>{ex.Message}, ReturnValue = null, Successed = false };
            }
        }

        public CustomResult EditCart(CartItem item)
        {
            try
            {                
                var result =  new CustomResult();
                var cart = _dbContext.CartItems.FirstOrDefault(x => x.Id == item.Id);
                if (cart == null)
                {
                    result.Message.Add("Id not found.");
                    result.Successed = false;
                }
                else{
                    item = _mapper.Map<CartItem, CartItem>(item,cart);
                }

                if (item.UserId != UserSettings.UserId)
                {
                    result.Message.Add("You have no permission to modify this item.");
                    result.Successed = false;
                }
                if (item.DateDelivery < System.DateTime.Now)
                {
                    result.Message.Add("Date is lesser than now.");
                    result.Successed = false;
                }
                if (_dbContext.MeasurementUnits.FirstOrDefault(x => x.Id == item.MeasurementUnitId) == null)
                {
                    result.Message.Add("There is no units.");
                    result.Successed = false;
                }
                if (result.Successed)
                {              
                    _dbContext.Entry(cart).CurrentValues.SetValues(item);
                    _dbContext.SaveChanges();

                    result.Message.Add("Cart item was modified.");
					result.ReturnValue = _dbContext.CartItems.FirstOrDefault(x => x.Id == item.Id);
                }

                return result;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new CustomResult { Message = new List<string> { ex.Message }, ReturnValue = null, Successed = false };
            }
        }
        public CustomResult DeleteCart(Guid id)
        {
            try
            {
                var result =  new CustomResult();
                var item = _dbContext.CartItems.FirstOrDefault(x => x.Id == id);
                if (item == null)
                {
                    result.Message.Add("Id not found.");
                    result.Successed = false;
                }
                if (item.UserId != UserSettings.UserId)
                {
                    result.Message.Add("You have no permission to modify this item.");
                    result.Successed = false;
                }
                if (result.Successed)
                {
                    _dbContext.Remove(item);
                    _dbContext.SaveChanges();

                    result.Message.Add("Cart item was added.");
					result.ReturnValue = item;
                }

                return result;
            }
            catch (System.Exception ex)
            {
                return new CustomResult { Message = new List<string> { ex.Message }, ReturnValue = null, Successed = false };
            }
        }

		public CustomResult DeleteAllCarts()
        {
            try
            {
                var result =  new CustomResult();
                var items = _dbContext.CartItems.FirstOrDefault(x => x.UserId == UserSettings.UserId);
                if (items == null)
                {
                    result.Message.Add("Id not found.");
                    result.Successed = false;
                }

                if (result.Successed)
                {
                    _dbContext.RemoveRange(items);
                    _dbContext.SaveChanges();

                    result.Message.Add("Cart item was added.");
					result.ReturnValue = items;
                }

                return result;
            }
            catch (System.Exception ex)
            {
                return new CustomResult { Message = new List<string> { ex.Message }, ReturnValue = null, Successed = false };
            }
        }

	}
}