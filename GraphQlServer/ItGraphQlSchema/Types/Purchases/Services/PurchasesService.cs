using System.Linq;
using ItGraphQlSchema.Custom;
using ItGraphQlSchema.Types.Purchases;
using ItGraphQlSchema.Types.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.Services{

	[AddInDI(typeof(IPurchasesService))]
    public class PurchasesService : IPurchasesService
    {
		private IHttpContextAccessor _httpContextAccessor;
		private IPurchasesDataProvider db;
		private CommonDbContext _dbContext => _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<CommonDbContext>();//(CommonDbContext)_httpContextAccessor.HttpContext.RequestServices.GetService(typeof(CommonDbContext));

		public PurchasesService(IPurchasesDataProvider db,IHttpContextAccessor httpContextAccessor){
			_httpContextAccessor = httpContextAccessor;
		}
        public CustomResult CreateCart(CartItem item)
        {
			try
			{				
				if(item.DateDelivery < System.DateTime.Now){
					return new CustomResult{Message="Date is lesser than now.", ReturnValue=null, Successed=false};
				}
				
				var test = _dbContext.MeasurementUnits.FirstOrDefault(x=>x.Id==item.MeasurementUnitId);
				if(test == null){
					return new CustomResult{Message="There is no units.", ReturnValue=null, Successed=false};
				}

				_dbContext.CartItems.Add(item);
				_dbContext.SaveChanges();				

				return new CustomResult{Message="Cart item was added.", Successed=true, ReturnValue=item};
			}
			catch (System.Exception ex)
			{
				return new CustomResult{Message=ex.Message, ReturnValue=null, Successed=false};
			}
        }

        public CustomResult EditCart(CartItem item)
        {
            try
			{				
				if(item.DateDelivery < System.DateTime.Now){
					return new CustomResult{Message="Date is lesser than now.", ReturnValue=null, Successed=false};
				}
				
				var test = _dbContext.MeasurementUnits.FirstOrDefault(x=>x.Id==item.MeasurementUnitId);
				if(test == null){
					return new CustomResult{Message="There is no units.", ReturnValue=null, Successed=false};
				}

				_dbContext.CartItems.Update(item);
				_dbContext.SaveChanges();				

				return new CustomResult{Message="Cart item was added.", Successed=true, ReturnValue=item};
			}
			catch (System.Exception ex)
			{
				return new CustomResult{Message=ex.Message, ReturnValue=null, Successed=false};
			}
        }

        public CustomResult DeleteCart(int id)
        {
            try
			{				
				var item = _dbContext.CartItems.FirstOrDefault(x=>x.Id == id);
				if(item == null){
					return new CustomResult{Message="Id not found.", Successed=false, ReturnValue=item};
				}

				_dbContext.Remove(item);
				_dbContext.SaveChanges();		

				return new CustomResult{Message="Cart item was added.", Successed=true, ReturnValue=item};
			}
			catch (System.Exception ex)
			{
				return new CustomResult{Message=ex.Message, ReturnValue=null, Successed=false};
			}
        }
    }
}