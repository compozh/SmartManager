using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vue2Spa.Models;

namespace Vue2Spa.Services.Logic
{
    /// <summary>
    /// Публичные методы бизнес логики приложения СКД
    /// </summary>
    public interface ISKDLogic
    {

        /// <summary>
        /// Получение готового списка пользователей
        /// </summary>
        /// <param name="ticket">ticket с сервера приложений</param>
        IEnumerable<AllUserInfo> GetFullUsers(string ticket);
    }
}
