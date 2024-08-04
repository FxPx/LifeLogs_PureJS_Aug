/* - - - - - - - - - - - - - - - - */
// /* src/app/ClientComponent.js | Client-Side Interactivity | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

'use client';
import { useState, useEffect, useCallback } from 'react';
import './FxStyles.css';

export default function Home() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingRow, setEditingRow] = useState(null);

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api');
      const result = await res.json();
      if (Array.isArray(result.data) && result.data.length > 0) {
        const [headerRow, ...rows] = result.data;
        setHeaders(headerRow);
        setData(rows.filter(row => row[0] && (row[1] || row[2])));
        setFormData(Object.fromEntries(headerRow.map((_, i) => [`col${i}`, ''])));
      } else {
        setData([]);
        setHeaders([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setData([]);
      setHeaders([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData(Object.fromEntries(headers.map((_, i) => [`col${i}`, ''])));
      fetchData();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Handle row deletion
  const handleDelete = async (col0) => {
    try {
      await fetch(`/api?col0=${col0}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  // Start editing a row
  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  // Save edited row data
  const handleSave = async (rowData) => {
    try {
      await fetch('/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });
      setEditingRow(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Handle input changes for both forms and table cells
  const handleInputChange = (e, setStateFunction) => {
    const { name, value } = e.target;
    setStateFunction(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <main>
      <h1>Life Logs</h1>

      <form onSubmit={handleSubmit}>
        {headers.map((header, index) => (
          <input
            key={index}
            type="text"
            name={`col${index}`}
            placeholder={header}
            value={formData[`col${index}`] || ''}
            onChange={e => handleInputChange(e, setFormData)}
          />
        ))}
        <button type="submit">Add Data</button>
      </form>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              {headers.map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {editingRow === rowIndex ? (
                      <input
                        type="text"
                        name={`col${cellIndex}`}
                        value={cell || ''}
                        onChange={e => handleInputChange(e, newData => 
                          setData(data.map((r, i) => 
                            i === rowIndex 
                              ? r.map((c, j) => j === cellIndex ? e.target.value : c) 
                              : r
                          ))
                        )}
                      />
                    ) : (
                      cell || ''
                    )}
                  </td>
                ))}
                <td>
                  {editingRow === rowIndex ? (
                    <>
                      <button onClick={() => handleSave(Object.fromEntries(row.map((cell, i) => [`col${i}`, cell])))}>Save</button>
                      <button onClick={() => setEditingRow(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(rowIndex)}>Edit</button>
                      <button onClick={() => handleDelete(row[0])}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
/* - - - - - - - - - - - - - - - - */