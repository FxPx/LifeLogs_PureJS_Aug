/* - - - - - - - - - - - - - - - - */
/* Main component for Life Logs | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

'use client'
import { useState, useEffect } from 'react'
import './FxStyles.css'

export default function Home() {
  /* - - - - - - - - - - - - - - - - */
  /* State variables | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const [data, setData] = useState([])
  const [formData, setFormData] = useState({ col1: '', col2: '', col3: '', col4: '' })
  const [editingRow, setEditingRow] = useState(null)
  const [editFormData, setEditFormData] = useState({ col0: '', col1: '', col2: '', col3: '', col4: '' })

  /* - - - - - - - - - - - - - - - - */
  /* Fetch data on component mount | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  useEffect(() => {
    fetchData()
  }, [])

  /* - - - - - - - - - - - - - - - - */
  /* Fetch data from API | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const fetchData = async () => {
    try {
      const res = await fetch('/api')
      const result = await res.json()

      // Ensure result.data is an array
      Array.isArray(result.data) ? setData(result.data) : setData([])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setData([])
    }
  }

  /* - - - - - - - - - - - - - - - - */
  /* Handle form submission | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ col1: '', col2: '', col3: '', col4: '' })
    fetchData()
  }

  /* - - - - - - - - - - - - - - - - */
  /* Handle delete operation | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const handleDelete = async (col0) => {
    await fetch(`/api?col0=${col0}`, { method: 'DELETE' })
    fetchData()
  }

  /* - - - - - - - - - - - - - - - - */
  /* Handle row edit | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex)
    const rowData = data[rowIndex + 1] || []
    setEditFormData({
      col0: rowData[0] || '',
      col1: rowData[1] || '',
      col2: rowData[2] || '',
      col3: rowData[3] || '',
      col4: rowData[4] || '',
    })
  }

  /* - - - - - - - - - - - - - - - - */
  /* Handle edit form changes | Sree | 04 Aug 2024 */
  /* - - - - - - - - - - - - - - - - */
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  /* - - - - - - - - - - - - - - - - */
  /* Handle save operation | Sree | 04 Aug 2024 */
  const handleSave = async () => {
    await fetch(`/api`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    })
    setEditingRow(null)
    fetchData()
  }

  /* - - - - - - - - - - - - - - - - */
  /* Check if a row is empty | Sree | 04 Aug 2024 */
  const isEmptyRow = (row) => row.every(cell => cell === '')

  return (
    <main>
      <h1>Life Logs</h1>
      
      <form onSubmit={handleSubmit}>
        {['col1', 'col2', 'col3', 'col4'].map((col, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Column ${idx + 1}`}
            value={formData[col]}
            onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
          />
        ))}
        <button type="submit">Add Data</button>
      </form>

      <table>
        <thead>
          <tr>
            {data.length > 0 && data[0].map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.slice(1).filter(row => !isEmptyRow(row)).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {editingRow === rowIndex ? (
                    <input
                      type="text"
                      name={`col${cellIndex}`}
                      value={editFormData[`col${cellIndex}`] || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    cell || ''
                  )}
                </td>
              ))}
              {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, index) => (
                <td key={row.length + index}>
                  {editingRow === rowIndex ? (
                    <input
                      type="text"
                      name={`col${row.length + index}`}
                      value={editFormData[`col${row.length + index}`] || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    ''
                  )}
                </td>
              ))}
              <td>
                {editingRow === rowIndex ? (
                  <button onClick={handleSave}>Save</button>
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
    </main>
  )
}
/* - - - - - - - - - - - - - - - - */
/* End of file | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */