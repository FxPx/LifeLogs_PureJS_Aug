// /* - - - - - - - - - - - - - - - - */
// /* Main component for Life Logs | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// 'use client'
// import { useState, useEffect } from 'react'
// import './FxStyles.css'

// export default function Home() {
//   const [data, setData] = useState([])
//   const [formData, setFormData] = useState({ col1: '', col2: '', col3: '', col4: '' })
//   const [editingRow, setEditingRow] = useState(null)
//   const [editFormData, setEditFormData] = useState({ col0: '', col1: '', col2: '', col3: '', col4: '' })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const res = await fetch('/api')
//       const result = await res.json()
//       Array.isArray(result.data) ? setData(result.data) : setData([])
//     } catch (error) {
//       console.error('Failed to fetch data:', error)
//       setData([])
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     await fetch('/api', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     })
//     setFormData({ col1: '', col2: '', col3: '', col4: '' })
//     fetchData()
//   }

//   const handleDelete = async (col0) => {
//     await fetch(`/api?col0=${col0}`, { method: 'DELETE' })
//     fetchData()
//   }

//   const handleEdit = (rowIndex) => {
//     setEditingRow(rowIndex)
//     const rowData = data[rowIndex + 1] || []
//     setEditFormData({
//       col0: rowData[0] || '',
//       col1: rowData[1] || '',
//       col2: rowData[2] || '',
//       col3: rowData[3] || '',
//       col4: rowData[4] || '',
//     })
//   }

//   const handleEditChange = (e) => {
//     const { name, value } = e.target
//     setEditFormData({ ...editFormData, [name]: value })
//   }

//   const handleSave = async () => {
//     await fetch(`/api`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(editFormData),
//     })
//     setEditingRow(null)
//     fetchData()
//   }

//   const isEmptyRow = (row) => row.every(cell => cell === '')

//   return (
//     <main>
//       <h1>Life Logs</h1>
      
//       <form onSubmit={handleSubmit}>
//         {['col1', 'col2', 'col3', 'col4'].map((col, idx) => (
//           <input
//             key={idx}
//             type="text"
//             placeholder={`Column ${idx + 1}`}
//             value={formData[col]}
//             onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
//           />
//         ))}
//         <button type="submit">Add Data</button>
//       </form>

//       <table>
//         <thead>
//           <tr>
//             {data.length > 0 && data[0].map((heading, index) => (
//               <th key={index}>{heading}</th>
//             ))}
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(data) && data.slice(1).filter(row => !isEmptyRow(row)).map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((cell, cellIndex) => (
//                 <td key={cellIndex}>
//                   {editingRow === rowIndex ? (
//                     <input
//                       type="text"
//                       name={`col${cellIndex}`}
//                       value={editFormData[`col${cellIndex}`] || ''}
//                       onChange={handleEditChange}
//                     />
//                   ) : (
//                     cell || ''
//                   )}
//                 </td>
//               ))}
//               {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, index) => (
//                 <td key={row.length + index}>
//                   {editingRow === rowIndex ? (
//                     <input
//                       type="text"
//                       name={`col${row.length + index}`}
//                       value={editFormData[`col${row.length + index}`] || ''}
//                       onChange={handleEditChange}
//                     />
//                   ) : (
//                     ''
//                   )}
//                 </td>
//               ))}
//               <td>
//                 {editingRow === rowIndex ? (
//                   <button onClick={handleSave}>Save</button>
//                 ) : (
//                   <>
//                     <button onClick={() => handleEdit(rowIndex)}>Edit</button>
//                     <button onClick={() => handleDelete(row[0])}>Delete</button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </main>
//   )
// }
// /* - - - - - - - - - - - - - - - - */
// /* End of file | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - */
/* page.js | Main component for Life Logs | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

'use client'
import { useState, useEffect } from 'react'
import './FxStyles.css'

export default function Home() {
  const [data, setData] = useState([])
  const [formData, setFormData] = useState({ col1: '', col2: '', col3: '', col4: '' }) // col0 will be handled automatically
  const [editingRow, setEditingRow] = useState(null)
  const [editFormData, setEditFormData] = useState({ col0: '', col1: '', col2: '', col3: '', col4: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api')
      const result = await res.json()
      Array.isArray(result.data) ? setData(result.data) : setData([])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setData([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ col1: '', col2: '', col3: '', col4: '' }) // Reset only editable columns
    fetchData()
  }

  const handleDelete = async (col0) => {
    await fetch(`/api?col0=${col0}`, { method: 'DELETE' })
    fetchData()
  }

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex)
    const rowData = data[rowIndex] || []
    setEditFormData({
      col0: rowData[0] || '',
      col1: rowData[1] || '',
      col2: rowData[2] || '',
      col3: rowData[3] || '',
      col4: rowData[4] || '',
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  const handleSave = async () => {
    await fetch(`/api`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    })
    setEditingRow(null)
    fetchData()
  }

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
          {Array.isArray(data) && data.filter(row => !isEmptyRow(row)).map((row, rowIndex) => (
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
              {row.length < 5 && Array.from({ length: 5 - row.length }).map((_, index) => (
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
