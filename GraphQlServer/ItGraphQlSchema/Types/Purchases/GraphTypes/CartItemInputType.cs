using GraphQL.Types;
using ItGraphQlSchema;

namespace ItGraphQlSchema.Types.Purchases
{
    [AddInDIAttribute]
    public class CartItemInputType : InputObjectGraphType<CartItem>
    {
        public CartItemInputType()
        {
            Name = "CartInput";
            Field(f=>f.Id, nullable:true).Description("Cart id");
            Field(f=>f.UserId, nullable:true).Description("User id");
            Field(f=>f.ResourceId, nullable:true).Description("Resource id");
            Field(f=>f.ResourceName).Description("Resource name");
            Field(f=>f.Quantity).Description("Quantity");
            Field(f=>f.MeasurementUnitId, nullable:true).Description("Measurement unit id");
            Field(f=>f.DateDelivery).Description("Date of delivery");
        }
    }
}