namespace Web.Data.Sql.SqlApi
{
	public class OracleApi : SqlApi
	{
		public override string DateTimeSql()
		{
			return "sysdate";
		}

		public override string EmptyFrom()
		{
			return "from dual";
		}

		public override string Nvl(string field, string value)
		{
			return string.Format("NVL({0},{1})", field, value);
		}

		public override string Left(string field, string length)
		{
			return string.Format("SUBSTR({0}, 1, {1})", field, length);
		}

		public override string Length(string expr)
		{
			return string.Format("LENGTH({0})", expr);
		}

		public override string Trim(string expr)
		{
			return string.Format("TRIM({0})", expr);
		}

		public override string AddDefaultSchema()
		{
			return string.Empty;
		}

		public override string EmptyString
		{
			get { return "' '"; }
		}
	}
}