using System.Collections.Generic;
using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.Model;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITEnterpriseMenuQuery:ObjectGraphType<object>
	{
		ITPortalProvider _provider;
		private List<MenuItem> _listMenuItem = new List<MenuItem>();
		private MenuParagraph _menuParagraph = new MenuParagraph();
		public ITEnterpriseMenuQuery(ITPortalProvider provider)
		{
			_provider = provider;
			Name = "Query";
			Field<ListGraphType<MenuItem>>("FavoriteItems", resolve: getFavoriteItems);
			Field<MenuParagraph>("MenuParagraph", resolve: getMenuParagraphItems);
		}

		private List<MenuItem> getFavoriteItems(ResolveFieldContext<object> context)
		{
			if (_listMenuItem == null || _listMenuItem.Count==0)
			{
				getDataFromServer();
			}

			return _listMenuItem;
		}
		
		private MenuParagraph getMenuParagraphItems(ResolveFieldContext<object> context)
		{
			if (_menuParagraph == null)
			{
				getDataFromServer();
			}

			return _menuParagraph;
		}

		/// <summary>
		/// Метод для записывания элементов в объекты
		/// </summary>
		private void getDataFromServer()
		{
			var data = _provider.GetFavoriteMenu(false).Result;
			_listMenuItem = getDeserializeMenuItem(data.GetValueOrDefault("Items"));
			_menuParagraph = getDeserializeMenuParagraph(data.GetValueOrDefault("FavoriteModuleContent"));
		}

		private List<MenuItem> getDeserializeMenuItem(object paragraph)
		{
			var result = JsonConvert.DeserializeObject<List<MenuItem>>(paragraph.ToString());
			return result;
		}

		private MenuParagraph getDeserializeMenuParagraph(object paragraph)
		{
			var result = JsonConvert.DeserializeObject<MenuParagraph>(paragraph.ToString());
			return result;
		}

	}
}