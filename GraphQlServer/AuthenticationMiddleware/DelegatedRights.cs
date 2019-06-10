namespace AuthenticationMiddleware
{
    /// <summary>
    /// Информация о пользователях чьи права были делегированны текущему пользователю
    /// </summary>
    public class DelegatedRights
    {
        public string UserName { get; set; }
        public string UserId { get; set; }
        public bool IsActive { get; set; }
    }
}