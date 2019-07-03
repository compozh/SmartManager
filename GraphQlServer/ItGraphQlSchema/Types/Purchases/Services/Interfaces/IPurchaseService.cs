using System;
using ItGraphQlSchema.Custom;
using ItGraphQlSchema.Types.Purchases;

namespace ItGraphQlSchema.Types.Services.Interfaces{
    public interface IPurchasesService
    {
        CustomResult CreateCart(CartItem item);
        CustomResult EditCart(CartItem item);
        CustomResult DeleteCart(Guid id);
        CustomResult DeleteAllCarts();
    }
}