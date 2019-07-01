using GraphQL;
using GraphQL.EntityFramework;
using GraphQL.Types;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ItGraphQlSchema.Types.Purchases
{
	[AddInDI]
	class PurchasesQueryMutation : ObjectGraphType
	{        
        private readonly IPurchasesService _service;

        public PurchasesQueryMutation(IPurchasesService service){            
            _service = service;
            Name = "PurchasesQueryMutation";
            Field<CartItemGraph>(
                "createCart",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<CartItemInputType>>{
                    Name="cart"
                }),
                resolve: c => {
                    var cardItem = c.GetArgument<CartItem>("cart");
                    var result = _service.CreateCart(cardItem);
                    if(result.Successed){
                        return result.ReturnValue;
                    }                    
                   
                    c.Errors.Add(new ExecutionError(result.Message));
                    return null;
                }
            );

            Field<CartItemGraph>(
                "updateCart",
                arguments:
                new QueryArguments(                    
                    new QueryArgument<NonNullGraphType<CartItemInputType>>{
                    Name="cart"
                }),
                resolve: c => {
                    var cardItem = c.GetArgument<CartItem>("cart");

                    return _service.EditCart(cardItem);
                }
            );

            Field<CartItemGraph>(
                "deleteCart",
                arguments:
                new QueryArguments(                    
                    new QueryArgument<NonNullGraphType<IdGraphType>>{
                    Name="cartId"
                }),
                resolve: c => {
                    var cardId = c.GetArgument<int>("cartId");

                    return _service.DeleteCart(cardId);
                }
            );
        }
    }
}