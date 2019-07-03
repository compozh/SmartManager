using GraphQL;
using GraphQL.Types;
using ItGraphQlSchema.Helpers;
using ItGraphQlSchema.Types.Services.Interfaces;
using System;

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

                    ErrorSender(c,result);
                    
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
                    var result = _service.EditCart(cardItem);
                    if(result.Successed){
                        return result.ReturnValue;
                    }

                    ErrorSender(c,result);
                    
                    return null;
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
                    var cardId = c.GetArgument<Guid>("cartId");
                    var result = _service.DeleteCart(cardId);
                    if(result.Successed){
                        return result.ReturnValue;
                    }                    
                    ErrorSender(c,result);
                    
                    return null;
                }
            );
            
            Field<CartItemGraph>(
                "deleteAllCarts",
                resolve: c => {
                    var result = _service.DeleteAllCarts();
                    if(result.Successed){
                        return result.ReturnValue;
                    }                    
                    ErrorSender(c,result);
                    
                    return null;
                }
            );
        }
    
        private void ErrorSender(ResolveFieldContext<object> context, CustomResult result){
            try
            {
                foreach(var item in result.Message){
                    context.Errors.Add( new ExecutionError(item));
                }
            }
            catch (System.Exception)
            {
                context.Errors.Add( new ExecutionError("Something went wrong."));
            }
        }
    }
}