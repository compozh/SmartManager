using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using Web.Tools;

namespace Web.Data
{
	/// <summary>
	/// Объект для чтения данных
	/// </summary>
	public class DataReader : DbDataReader
	{
		private readonly DbDataReader _realReader;
		private readonly SqlCmd _command;

		/// <summary>
		/// Автоматически конвертировать <c>null</c> в пустое значение
		/// </summary>
		public bool AutoConvertNull
		{
			get;
			set;
		}

		/// <summary>
		///SQL-команда
		/// </summary>
		internal SqlCmd Command
		{
			get { return _command; }
		}

		internal DataReader(DbDataReader realReader, SqlCmd command)
		{
			_realReader = realReader;
			_command = command;
			AutoConvertNull = true;
		}

		#region DbDataReader

		/// <summary>
		/// Закрыть
		/// </summary>
		public override void Close()
		{
			_realReader.Close();
		}

		public override int Depth
		{
			get { return _realReader.Depth; }
		}

		public override int FieldCount
		{
			get { return _realReader.FieldCount; }
		}

		public override bool GetBoolean(int ordinal)
		{
			return _realReader.GetBoolean(ordinal);
		}

		public override byte GetByte(int ordinal)
		{
			return _realReader.GetByte(ordinal);
		}

		public override long GetBytes(int ordinal, long dataOffset, byte[] buffer, int bufferOffset, int length)
		{
			return _realReader.GetBytes(ordinal, dataOffset, buffer, bufferOffset, length);
		}

		public override char GetChar(int ordinal)
		{
			return _realReader.GetChar(ordinal);
		}

		public override long GetChars(int ordinal, long dataOffset, char[] buffer, int bufferOffset, int length)
		{
			return _realReader.GetChars(ordinal, dataOffset, buffer, bufferOffset, length);
		}

		public override string GetDataTypeName(int ordinal)
		{
			return _realReader.GetDataTypeName(ordinal);
		}

		public override DateTime GetDateTime(int ordinal)
		{
			return _realReader.GetDateTime(ordinal);
		}

		public override decimal GetDecimal(int ordinal)
		{
			return _realReader.GetDecimal(ordinal);
		}

		public override double GetDouble(int ordinal)
		{
			return _realReader.GetDouble(ordinal);
		}

		public override IEnumerator GetEnumerator()
		{
			return _realReader.GetEnumerator();
		}

		public override Type GetFieldType(int ordinal)
		{
			return _realReader.GetFieldType(ordinal);
		}

		public override float GetFloat(int ordinal)
		{
			return _realReader.GetFloat(ordinal);
		}

		public override Guid GetGuid(int ordinal)
		{
			return _realReader.GetGuid(ordinal);
		}

		public override short GetInt16(int ordinal)
		{
			return _realReader.GetInt16(ordinal);
		}

		public override int GetInt32(int ordinal)
		{
			return _realReader.GetInt32(ordinal);
		}

		public override long GetInt64(int ordinal)
		{
			return _realReader.GetInt64(ordinal);
		}

		public override string GetName(int ordinal)
		{
			return _realReader.GetName(ordinal);
		}

		public override int GetOrdinal(string name)
		{
			return _realReader.GetOrdinal(name);
		}

		public override System.Data.DataTable GetSchemaTable()
		{
			return _realReader.GetSchemaTable();
		}

		public override string GetString(int ordinal)
		{
			return _realReader.GetString(ordinal);
		}

		public override object GetValue(int ordinal)
		{
			return _realReader.GetValue(ordinal);
		}

		public override int GetValues(object[] values)
		{
			int fieldCount = _realReader.GetValues(values);
			for (int i = 0; i < values.Length; i++)
			{
				convertValue(ref values[i], i);
			}
			return fieldCount;
		}

		/// <summary>
		/// Получить текущую строку в виде словаря: имя_поля=значение
		/// </summary>
		/// <returns></returns>
		public Dictionary<string, object> ToDictionary()
		{
			var valuesDictionary = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
			var values = new object[FieldCount];
			GetValues(values);
			for (int i = 0; i < FieldCount; i++)
			{
				valuesDictionary.Add(GetName(i), values[i]);
			}
			return valuesDictionary;
		}

		public override bool HasRows
		{
			get { return _realReader.HasRows; }
		}

		public override bool IsClosed
		{
			get { return _realReader.IsClosed; }
		}

		public override bool IsDBNull(int ordinal)
		{
			return _realReader.IsDBNull(ordinal);
		}

		public override bool NextResult()
		{
			return _realReader.NextResult();
		}

		/// <summary>
		/// Перейти к следующей строке
		/// </summary>
		/// <returns>False, если строк больше нет</returns>
		public override bool Read()
		{
			try
			{
				return _realReader.Read();
			}
			catch (DbException )
			{
				return false;
			}
		}

		public override int RecordsAffected
		{
			get { return _realReader.RecordsAffected; }
		}

		/// <summary>
		/// Получить значение ячейки текущей строки
		/// </summary>
		/// <param name="name">Имя поля</param>
		/// <returns>Значение поля</returns>
		public override object this[string name]
		{
			get
			{
				int ordinal = GetOrdinal(name);
				return this[ordinal];
			}
		}

		/// <summary>
		/// Получить значение ячейки текущей строки
		/// </summary>
		/// <param name="ordinal">Номер поля</param>
		/// <returns>Значение поля</returns>
		public override object this[int ordinal]
		{
			get
			{
				object value = _realReader[ordinal];
				convertValue(ref value, ordinal);
				return value;
			}
		}

		/// <summary>
		/// Конвертировать значение
		/// </summary>
		/// <param name="value"></param>
		/// <param name="ordinal"></param>
		/// <returns></returns>
		private void convertValue(ref object value, int ordinal)
		{
			convertValue(ref value, AutoConvertNull, false, () => GetFieldType(ordinal));
		}

		private static void convertValue(ref object value, bool convertNull, bool trimEnd, GetColumnType getColumnTypeDelegate)
		{
			if (convertNull && value is DBNull)
			{
				value = TypeTools.GetDefaultValue(getColumnTypeDelegate());
				return;
			}
			if (trimEnd && value is string)
			{
				value = ((string)value).TrimEnd();
			}
		}

		#endregion

		/// <summary>
		/// Ссылка на метод получения типа колонки
		/// </summary>
		/// <returns></returns>
		public delegate Type GetColumnType();

		protected override void Dispose(bool disposing)
		{
			Close();
			base.Dispose(disposing);
		}

		public string GetString(string field)
		{
			var value = _realReader[field];
			if (value != null && value != DBNull.Value)
			{
				return ((string)value).Trim();
			}
			return string.Empty;
		}

		public int GetInt32(string field)
		{
			var value = _realReader[field];
			if (value != null && value != DBNull.Value)
			{
				var intValue = Convert.ChangeType(value, TypeCode.Int32);
				if (intValue != null)
				{
					return (int)intValue;
				}
			}
			return 0;
		}

		public short GetInt16(string field)
		{
			var value = _realReader[field];
			if (value != null && value != DBNull.Value)
			{
				return (short)value;
			}
			return 0;
		}

		public DateTime GetDateTime(string field)
		{
			var value = _realReader[field];
			if (value != null && value != DBNull.Value)
			{
				return (DateTime)value;
			}
			return DateTime.MinValue;
		}

		public decimal GetDecimal(string field)
		{
			return GetDecimal(GetOrdinal(field));
		}
	}
}