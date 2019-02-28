namespace Web.Data.Sql.SqlApi
{
	public abstract class SqlApi
	{
		public abstract string DateTimeSql();
		public abstract string EmptyFrom();
		public abstract string Nvl(string field, string value);
		public abstract string Left(string tKwcat, string lenCatKorgt);
		public abstract string Length(string catKorgt);
		public abstract string Trim(string expr);
		public abstract string AddDefaultSchema();
		public abstract string EmptyString { get; }

		/// <summary>
		/// Если условие condition истинно, то выполнить 
		/// <paramref name="trueExpression"/>, иначе - выполнить 
		/// <paramref name="falseExpression"/>
		/// </summary>
		/// <param name="condition">Условие</param>
		/// <param name="trueExpression">Действие, которое выполняется если условие истинно
		/// </param>
		/// <param name="falseExpression">Действие, которое выполняется если условие ложно
		/// </param>
		/// <returns>Выражение для Sql</returns>
		public string Iif(string condition, string trueExpression, string falseExpression)
		{
			var result = string.Concat(" CASE WHEN ", condition, " THEN ",
				trueExpression, " ELSE ", falseExpression, " END ");
			return result;
		}
	}
}