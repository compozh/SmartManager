using System;
using System.Collections;
using System.Collections.Generic;

namespace Web.Tools
{
	public class ConnectionStringSettingsCollection : IDictionary<string, ConnectionStringSettings>
	{
		private readonly Dictionary<string, ConnectionStringSettings> m_ConnectionStrings;

		public ConnectionStringSettingsCollection()
		{
			m_ConnectionStrings = new Dictionary<string, ConnectionStringSettings>();
		}

		public ConnectionStringSettingsCollection(int capacity)
		{
			m_ConnectionStrings = new Dictionary<string, ConnectionStringSettings>(capacity);
		}

		#region IEnumerable methods

		IEnumerator IEnumerable.GetEnumerator()
		{
			return ((IEnumerable)m_ConnectionStrings).GetEnumerator();
		}

		#endregion

		#region IEnumerable<> methods

		IEnumerator<KeyValuePair<string, ConnectionStringSettings>> IEnumerable<KeyValuePair<string, ConnectionStringSettings>>.GetEnumerator()
		{
			return ((IEnumerable<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).GetEnumerator();
		}

		#endregion

		#region ICollection<> methods

		void ICollection<KeyValuePair<string, ConnectionStringSettings>>.Add(KeyValuePair<string, ConnectionStringSettings> item)
		{
			((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).Add(item);
		}

		void ICollection<KeyValuePair<string, ConnectionStringSettings>>.Clear()
		{
			((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).Clear();
		}

		bool ICollection<KeyValuePair<string, ConnectionStringSettings>>.Contains(KeyValuePair<string, ConnectionStringSettings> item)
		{
			return ((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).Contains(item);
		}

		void ICollection<KeyValuePair<string, ConnectionStringSettings>>.CopyTo(KeyValuePair<string, ConnectionStringSettings>[] array, Int32 arrayIndex)
		{
			((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).CopyTo(array, arrayIndex);
		}

		bool ICollection<KeyValuePair<string, ConnectionStringSettings>>.Remove(KeyValuePair<string, ConnectionStringSettings> item)
		{
			return ((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).Remove(item);
		}

		public Int32 Count => ((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).Count;
		public bool IsReadOnly => ((ICollection<KeyValuePair<string, ConnectionStringSettings>>)m_ConnectionStrings).IsReadOnly;

		#endregion

		#region IDictionary<> methods

		public void Add(string key, ConnectionStringSettings value)
		{
			// NOTE only slight modification, we add back in the Name of connectionString here (since it is the key)
			value.Name = key;
			m_ConnectionStrings.Add(key, value);
		}

		public bool ContainsKey(string key)
		{
			return m_ConnectionStrings.ContainsKey(key);
		}

		public bool Remove(string key)
		{
			return m_ConnectionStrings.Remove(key);
		}

		public bool TryGetValue(string key, out ConnectionStringSettings value)
		{
			return m_ConnectionStrings.TryGetValue(key, out value);
		}

		public ConnectionStringSettings this[string key]
		{
			get => m_ConnectionStrings[key];
			set => Add(key, value);
		}

		public ICollection<string> Keys => m_ConnectionStrings.Keys;
		public ICollection<ConnectionStringSettings> Values => m_ConnectionStrings.Values;

		#endregion
	}
}