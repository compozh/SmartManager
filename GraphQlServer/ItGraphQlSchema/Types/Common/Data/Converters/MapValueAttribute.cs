using System;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.Common
{
	/// <summary>
	/// Параметры элемента перечня (enum-a)
	/// </summary>
	[Serializable, AttributeUsage(AttributeTargets.Field, AllowMultiple = true)]
	public class MapValueAttribute : Attribute
	{
		public object Value { get; private set; }
		
		private string _caption;

		/// <summary>
		/// Наименование элемента перечня.
		/// </summary>
		public string Caption
		{
			get { return _caption ?? CaptionResourceName; }
			set { _caption = value; }
		}

		/// <summary>
		/// <para>Код строки в ресурсах, с многоязычным наименованием перечня. Если задано - заменяет свойство <see cref="Caption"/></para>
		/// <para></para>
		/// </summary>
		/// <exclude />
		[System.ComponentModel.Browsable(false), System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
		public string CaptionResourceName { get; set; }

		/// <summary>
		/// Создать атрибут для элемента перечня (enum-a)
		/// </summary>
		/// <param name="value">Значение поля в SQL</param>
		public MapValueAttribute(object value)
		{
			Value = value;
		}

		/// <summary>
		/// Признак что данное поле установлено по умолчанию
		/// </summary>
		public bool IsDefaultValue { get; set; }
	}

	public static class EnumMapper
	{
		private static readonly Dictionary<Type, Dictionary<object, Enum>> ValuesCache =
			new Dictionary<Type, Dictionary<object, Enum>>();
		
		public static T GetMappedValue<T>(this Enum value) {
			var type = value.GetType();
			
			var fieldInfo = type.GetField(value.ToString());
			
			var attribs = fieldInfo.GetCustomAttributes(
				typeof(MapValueAttribute), false) as MapValueAttribute[];
			
			return attribs != null 
					&& attribs.Length > 0 
					&& attribs[0].Value is T 
				? (T)attribs[0].Value 
				: default;
		}
		
		public static TEnum GetEnumFromMappedValue<TEnum>(object value) where TEnum : Enum {
			var type = typeof(TEnum);

			if (value is string s)
			{
				value = s.Trim();
			}

			if (ValuesCache.TryGetValue(type, out var valuesMappings))
			{
				if (valuesMappings.TryGetValue(value, out var result))
				{
					return (TEnum)result;
				}

				return default;
			}
			
			var fieldInfo = type.GetFields();
			var mappings = new Dictionary<object, Enum>();
			foreach (var info in fieldInfo)
			{
				var attribs = info.GetCustomAttributes(
					typeof(MapValueAttribute), false) as MapValueAttribute[];
				if (attribs != null && attribs.Length > 0)
				{
					var enumObject = Enum.Parse(type, info.Name);
					mappings.Add(attribs[0].Value, enumObject is TEnum ? (TEnum)enumObject : default);
				}
			}
			
			ValuesCache.Add(type, mappings);
			
			if (mappings.TryGetValue(value, out var mappingResult))
			{
				return (TEnum)mappingResult;
			}

			return default;
		}
	}
}