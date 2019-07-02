using System;
using System.Collections.Generic;
using System.Linq;
using ItGraphQlSchema.Custom;
using ItGraphQlSchema.Types.Purchases;
using ItGraphQlSchema.Types.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.Services
{

    [AddInDI(typeof(IPurchasesService))]
    public class PurchasesService : IPurchasesService
    {
        private IHttpContextAccessor _httpContextAccessor;
        public PurchasesUserSettings UserSettings;
        private CommonDbContext _dbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();//(CommonDbContext)_httpContextAccessor.HttpContext.RequestServices.GetService(typeof(CommonDbContext));

        public PurchasesService(IPurchasesUserSettingsProvider userSettingsProvider, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            UserSettings = userSettingsProvider.GetCurrentSettings().Result;
        }
        public CustomResult CreateCart(CartItem item)
        {
            try
            {
                var result = new CustomResult { Successed = true };
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
                var result = new CustomResult { Successed = true };
                var cart = _dbContext.CartItems.FirstOrDefault(x => x.Id == item.Id);
                if (cart == null)
                {
                    result.Message.Add("Id not found.");
                    result.Successed = false;
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
                    _dbContext.CartItems.Update(item);
                    _dbContext.SaveChanges();

                    result.Message.Add("Cart item was modified.");
					result.ReturnValue = _dbContext.CartItems.FirstOrDefault(x => x.Id == item.Id);
                }

                return result;
            }
            catch (System.Exception ex)
            {
                return new CustomResult { Message = new List<string> { ex.Message }, ReturnValue = null, Successed = false };
            }
        }

        public CustomResult DeleteCart(Guid id)
        {
            try
            {
                var result = new CustomResult { Successed = true, Message=new List<string>() };
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
    }
}