/* - - - - - - - - - - - - - - - - */
/* page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

'use client'
import { useState, useEffect } from 'react'
import './FxStyles.css'

export default function Home() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [formData, setFormData] = useState({})
  const [editingRow, setEditingRow] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api')
      const result = await res.json()
      if (Array.isArray(result.data) && result.data.length > 0) {
        const headerRow = result.data[0]
        setHeaders(headerRow)

        // Filter rows: first column should not be empty, and either 2nd or 3rd column should have values
        const filteredData = result.data.slice(1).filter(row =>
          row[0] && (row[1] || row[2])
        )
        setData(filteredData)
        initializeFormData(headerRow)
      } else {
        setData([])
        setHeaders([])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setData([])
      setHeaders([])
    }
  }

  const initializeFormData = (headers) => {
    const newFormData = {}
    headers.forEach((_, index) => {
      newFormData[`col${index}`] = ''
    })
    setFormData(newFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      initializeFormData(headers)
      fetchData()
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  const handleDelete = async (col0) => {
    try {
      await fetch(`/api?col0=${col0}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete data:', error)
    }
  }

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex)
    const rowData = data[rowIndex] || []
    const newEditFormData = {}
    headers.forEach((_, index) => {
      newEditFormData[`col${index}`] = rowData[index] || ''
    })
    setEditFormData(newEditFormData)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await fetch(`/api`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })
      setEditingRow(null)
      fetchData()
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

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
            onChange={e => setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }))}
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
                        value={editFormData[`col${cellIndex}`] || ''}
                        onChange={handleEditChange}
                      />
                    ) : (
                      cell || ''
                    )}
                  </td>
                ))}
                <td>
                  {editingRow === rowIndex ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button type="button" onClick={() => setEditingRow(null)}>Cancel</button>
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

      {editingRow !== null && (
        <div>
          <h3>Edit Row</h3>
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            {headers.map((header, index) => (
              <input
                key={index}
                type="text"
                name={`col${index}`}
                value={editFormData[`col${index}`] || ''}
                onChange={handleEditChange}
              />
            ))}
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingRow(null)}>Cancel</button>
          </form>
        </div>
      )}
    </main>
  )
}

/* - - - - - - - - - - - - - - - - */