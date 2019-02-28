namespace Web.Data.Sql.SqlApi
{
	public class MsSqlApi : SqlApi
	{
		public override string DateTimeSql()
		{
			return "convert(datetime,convert(char,getdate(),120),120)";
		}

		public override string EmptyFrom()
		{
			return string.Empty;
		}

		public override string Nvl(string field, string value)
		{
			return string.Format("ISNULL({0},{1})", field, value);
		}

		public override string Left(string field, string length)
		{
			return string.Format("LEFT({0}, {1})", field, length);
		}

		public override string Length(string expr)
		{
			return string.Format("LEN({0})", expr);
		}

		public override string Trim(string expr)
		{
			return string.Format("RTRIM(LTRIM({0}))", expr);
		}

		public override string AddDefaultSchema()
		{
			return "dbo.";
		}

		public override string EmptyString
		{
			get { return "''"; }
		}
	}
}