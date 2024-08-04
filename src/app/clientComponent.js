// /* - - - - - - - - - - - - - - - - */
// /* src/app/FxShowAllData.js | Client-Side Interactivity | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import './FxStyles.css';

// export default function Home() {
//     const [data, setData] = useState([]);
//     const [headers, setHeaders] = useState([]);
//     const [formData, setFormData] = useState({});
//     const [editingRow, setEditingRow] = useState(null);

//     // Fetch data from the API
//     const fetchData = useCallback(async () => {
//         try {
//             const res = await fetch('/api');
//             const { data: result } = await res.json();
//             if (Array.isArray(result) && result.length > 0) {
//                 const [headerRow, ...rows] = result;
//                 setHeaders(headerRow);
//                 setData(rows.filter(row => row[0] && (row[1] || row[2])));
//                 setFormData(Object.fromEntries(headerRow.map((_, i) => [`col${i}`, ''])));
//             } else {
//                 setData([]);
//                 setHeaders([]);
//             }
//         } catch (error) {
//             console.error('Failed to fetch data:', error);
//             setData([]);
//             setHeaders([]);
//         }
//     }, []);

//     // Fetch data on component mount
//     useEffect(() => { fetchData(); }, [fetchData]);

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await fetch('/api', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
//             setFormData(Object.fromEntries(headers.map((_, i) => [`col${i}`, ''])));
//             fetchData();
//         } catch (error) {
//             console.error('Failed to save data:', error);
//         }
//     };

//     // Handle row deletion
//     const handleDelete = async (col0) => {
//         try {
//             await fetch(`/api?col0=${col0}`, { method: 'DELETE' });
//             fetchData();
//         } catch (error) {
//             console.error('Failed to delete data:', error);
//         }
//     };

//     // Handle row save
//     const handleSave = async (rowData) => {
//         try {
//             await fetch('/api', {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(rowData),
//             });
//             setEditingRow(null);
//             fetchData();
//         } catch (error) {
//             console.error('Failed to save data:', error);
//         }
//     };

//     // Handle input change for both form and table
//     const handleInputChange = (e, index, isFormData = true) => {
//         const { name, value } = e.target;
//         if (isFormData) {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         } else {
//             setData(prev => prev.map((row, i) =>
//                 i === editingRow ? row.map((cell, j) => j === index ? value : cell) : row
//             ));
//         }
//     };

//     return (
//         <main>
//             <h1>Life Logs</h1>
//             <form onSubmit={handleSubmit}>
//                 {headers.map((header, index) => (
//                     <input
//                         key={index}
//                         type="text"
//                         name={`col${index}`}
//                         placeholder={header}
//                         value={formData[`col${index}`] || ''}
//                         onChange={e => handleInputChange(e, index)}
//                     />
//                 ))}
//                 <button type="submit">Add Data</button>
//             </form>
//             <div className='table-container'>
//                 <table>
//                     <thead>
//                         <tr>
//                             {headers.map((heading, index) => <th key={index}>{heading}</th>)}
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((row, rowIndex) => (
//                             <tr key={rowIndex}>
//                                 {row.map((cell, cellIndex) => (
//                                     <td key={cellIndex}>
//                                         {editingRow === rowIndex ? (
//                                             <input
//                                                 type="text"
//                                                 name={`col${cellIndex}`}
//                                                 value={cell || ''}
//                                                 onChange={e => handleInputChange(e, cellIndex, false)}
//                                             />
//                                         ) : cell || ''}
//                                     </td>
//                                 ))}
//                                 <td>
//                                     {editingRow === rowIndex ? (
//                                         <>
//                                             <button onClick={() => handleSave(Object.fromEntries(row.map((cell, i) => [`col${i}`, cell])))}>Save</button>
//                                             <button onClick={() => setEditingRow(null)}>Cancel</button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <button onClick={() => setEditingRow(rowIndex)}>Edit</button>
//                                             <button onClick={() => handleDelete(row[0])}>Delete</button>
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </main>
//     );
// }
// /* - - - - - - - - - - - - - - - - */



'use client';
import { useState, useEffect, useCallback } from 'react';
import './FxStyles.css';

export default function FxShowAllData({ initialHeaders, initialData, initialFormData }) {
    const [data, setData] = useState(initialData || []);
    const [headers, setHeaders] = useState(initialHeaders || []);
    const [formData, setFormData] = useState(initialFormData || {});
    const [editingRow, setEditingRow] = useState(null);

    // Fetch data from the API
    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api');
            const { data: result } = await res.json();
            if (Array.isArray(result) && result.length > 0) {
                const [headerRow, ...rows] = result;
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

    // Fetch data on component mount if no initial data provided
    useEffect(() => {
        if (!initialData || !initialHeaders) {
            fetchData();
        }
    }, [fetchData, initialData, initialHeaders]);

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

    // Handle row save
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

    // Handle input change for both form and table
    const handleInputChange = (e, index, isFormData = true) => {
        const { name, value } = e.target;
        if (isFormData) {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setData(prev => prev.map((row, i) =>
                i === editingRow ? row.map((cell, j) => j === index ? value : cell) : row
            ));
        }
    };

    return (
        <>
            <h1>Life Logs</h1>
            <form onSubmit={handleSubmit}>
                {headers.map((header, index) => (
                    <input
                        key={index}
                        type="text"
                        name={`col${index}`}
                        placeholder={header}
                        value={formData[`col${index}`] || ''}
                        onChange={e => handleInputChange(e, index)}
                    />
                ))}
                <button type="submit">Add Data</button>
            </form>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            {headers.map((heading, index) => <th key={index}>{heading}</th>)}
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
                                                onChange={e => handleInputChange(e, cellIndex, false)}
                                            />
                                        ) : cell || ''}
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
                                            <button onClick={() => setEditingRow(rowIndex)}>Edit</button>
                                            <button onClick={() => handleDelete(row[0])}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}