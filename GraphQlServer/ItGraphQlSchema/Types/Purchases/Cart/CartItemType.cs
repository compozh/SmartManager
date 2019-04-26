using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types
{
	public class CartItemType : ObjectGraphType<CartItem>,IItAddInSingleton
	{
		public CartItemType(PurchasesProvider provider)
		{
			Name = "CartItem";
			Field(p => p.Id).Description("Идентификатор элемента");
			Field(p => p.ResourceId).Description("Идентификатор ресурса");
			Field(p => p.ResourceName).Description("Наименование ресурса");
			Field(p => p.Quantity).Description("Количество");
			Field(p => p.MeasureUnit).Description("ЕИ");
			Field(p => p.DateDelivery).Description("Плановая дата поставки");
		}
	}


	public class CartTableType : ObjectGraphType,IItAddInSingleton
	{
		public CartTableType()
		{
			Name = "CartItemsTable";
			Field<ListGraphType<CartItemType>>("data", description: "Данные с корзины");
			Field<ListGraphType<CartItemColumnType>>("columns", description: "Перечень колонок");
		}
	}


	public class CartItemColumnType : ObjectGraphType,IItAddInSingleton
	{
		public CartItemColumnType()
		{
			Name = " CartItemsColumns";
			Field<StringGraphType>("key", "Ключ колонки");
			Field<StringGraphType>("caption", "Заголовок колонки");
		}

	}
}
