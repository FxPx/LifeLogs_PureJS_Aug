// /* - - - - - - - - - - - - - - - - */
// /* src/app/fxFetchAllData.js | Client-Side Interactivity | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { parse, format, isValid } from 'date-fns';
// import './FxStyles.css';

// // Format the date
// const formatDate = (dateString) => {
//     const parsedDate = parse(dateString, 'M/d/yyyy h:mma', new Date());
//     return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : dateString;
// };

// // Ensure headers have the minimum required columns
// const ensureHeaders = (headers) => {
//     const defaultHeaders = Array.from({ length: 5 }, (_, i) => `Column ${i + 1}`);
//     return headers.length >= 5 ? headers : [...headers, ...defaultHeaders.slice(headers.length)];
// };

// // Pad the row to ensure it has 5 columns
// const padRow = (row) => [...row, ...Array(5 - row.length).fill('')];

// // Group data by month-year
// const groupByMonth = (rows) => {
//     return rows.reduce((acc, row) => {
//         const parsedDate = parse(row[0], 'M/d/yyyy h:mma', new Date());
//         if (isValid(parsedDate)) {
//             const monthYear = format(parsedDate, 'MMM yyyy');
//             if (!acc[monthYear]) {
//                 acc[monthYear] = [];
//             }
//             acc[monthYear].push(row);
//         } else {
//             if (!acc['Invalid Dates']) {
//                 acc['Invalid Dates'] = [];
//             }
//             acc['Invalid Dates'].push(row);
//         }
//         return acc;
//     }, {});
// };

// // Calculate averages for specified columns
// const calculateAverages = (rows, columns) => {
//     const sums = columns.map(() => 0);
//     const counts = columns.map(() => 0);

//     rows.forEach(row => {
//         columns.forEach((colIndex, i) => {
//             const value = parseFloat(row[colIndex]);
//             if (!isNaN(value)) {
//                 sums[i] += value;
//                 counts[i]++;
//             }
//         });
//     });

//     return sums.map((sum, i) => counts[i] ? (sum / counts[i]).toFixed(2) : '');
// };

// export default function FxShowAllData({ initialHeaders, initialData, initialFormData }) {
//     const [data, setData] = useState(initialData || []);
//     const [headers, setHeaders] = useState(initialHeaders || []);
//     const [formData, setFormData] = useState(() => {
//         const initialForm = Object.fromEntries((initialHeaders || []).map((_, i) => [`col${i}`, '']));
//         initialForm.col0 = format(new Date(), 'M/d/yyyy h:mma'); // Set current date-time for col0
//         return initialForm;
//     });
//     const [editingRow, setEditingRow] = useState(null);

//     // Fetch data from API
//     const fetchData = useCallback(async () => {
//         try {
//             const res = await fetch(`/api?cachebuster=${Date.now()}`, { cache: 'no-cache' });
//             const { data: result } = await res.json();
//             if (Array.isArray(result) && result.length > 0) {
//                 const [headerRow, ...rows] = result;
//                 const paddedHeaders = ensureHeaders(headerRow);
//                 setHeaders(paddedHeaders);
//                 setData(rows.map(padRow));
//                 const initialForm = Object.fromEntries(paddedHeaders.map((_, i) => [`col${i}`, '']));
//                 initialForm.col0 = format(new Date(), 'M/d/yyyy h:mma'); // Set current date-time for col0
//                 setFormData(initialForm);
//             } else {
//                 const defaultHeaders = ensureHeaders([]);
//                 setData([]);
//                 setHeaders(defaultHeaders);
//                 const initialForm = Object.fromEntries(defaultHeaders.map((_, i) => [`col${i}`, '']));
//                 initialForm.col0 = format(new Date(), 'M/d/yyyy h:mma'); // Set current date-time for col0
//                 setFormData(initialForm);
//             }
//         } catch (error) {
//             console.error('Failed to fetch data:', error);
//             const defaultHeaders = ensureHeaders([]);
//             setData([]);
//             setHeaders(defaultHeaders);
//             const initialForm = Object.fromEntries(defaultHeaders.map((_, i) => [`col${i}`, '']));
//             initialForm.col0 = format(new Date(), 'M/d/yyyy h:mma'); // Set current date-time for col0
//             setFormData(initialForm);
//         }
//     }, []);

//     useEffect(() => {
//         if (!initialData || !initialHeaders) {
//             fetchData();
//         }
//     }, [fetchData, initialData, initialHeaders]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await fetch('/api', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//                 cache: 'no-cache',
//             });
//             setFormData(Object.fromEntries(headers.map((_, i) => [`col${i}`, ''])));
//             fetchData();
//         } catch (error) {
//             console.error('Failed to save data:', error);
//         }
//     };

//     const handleDelete = async (col0) => {
//         try {
//             await fetch(`/api?col0=${col0}&cachebuster=${Date.now()}`, {
//                 method: 'DELETE',
//                 cache: 'no-cache',
//             });
//             fetchData();
//         } catch (error) {
//             console.error('Failed to delete data:', error);
//         }
//     };

//     const handleSave = async (rowData) => {
//         try {
//             await fetch('/api', {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(rowData),
//                 cache: 'no-cache',
//             });
//             setEditingRow(null);
//             fetchData();
//         } catch (error) {
//             console.error('Failed to save data:', error);
//         }
//     };

//     const handleInputChange = (e, index, isFormData = true) => {
//         const { name, value } = e.target;
//         isFormData
//             ? setFormData(prev => ({ ...prev, [name]: value }))
//             : setData(prev => prev.map((row, i) =>
//                 i === editingRow ? row.map((cell, j) => j === index ? value : cell) : row
//             ));
//     };

//     const groupedData = groupByMonth(data);
//     const sortedMonths = Object.keys(groupedData).sort((a, b) => {
//         if (a === 'Invalid Dates') return 1;
//         if (b === 'Invalid Dates') return -1;
//         return new Date(a) - new Date(b);
//     });

//     return (
//         <>
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
//             <div className='wrapTable'>
//                 <table>
//                     <thead>
//                         <tr>
//                             {headers.map((heading, index) => <th key={index}>{heading}</th>)}
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sortedMonths.map((monthYear) => (
//                             <React.Fragment key={monthYear}>
//                                 <tr className='monthHeader'>
//                                     <td>{monthYear}</td>
//                                     {calculateAverages(groupedData[monthYear], [1, 2]).map((avg, index) => (
//                                         <td key={index + 1}>{avg}</td>
//                                     ))}
//                                     {Array(headers.length - 2).fill().map((_, index) => (
//                                         <td key={index + headers.length - 1}></td>
//                                     ))}
//                                 </tr>
//                                 {groupedData[monthYear].map((row, rowIndex) => (
//                                     <tr key={`${monthYear}-${rowIndex}`}>
//                                         {headers.map((_, cellIndex) => (
//                                             <td key={cellIndex}>
//                                                 {editingRow === `${monthYear}-${rowIndex}` ? (
//                                                     <input
//                                                         type="text"
//                                                         name={`col${cellIndex}`}
//                                                         value={row[cellIndex] || ''}
//                                                         onChange={e => handleInputChange(e, cellIndex, false)}
//                                                     />
//                                                 ) : cellIndex === 0 ? formatDate(row[cellIndex]) : row[cellIndex] || ''}
//                                             </td>
//                                         ))}
//                                         <td>
//                                             {editingRow === `${monthYear}-${rowIndex}` ? (
//                                                 <>
//                                                     <button onClick={() => handleSave(row)}>Save</button>
//                                                     <button onClick={() => setEditingRow(null)}>Cancel</button>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <button onClick={() => setEditingRow(`${monthYear}-${rowIndex}`)}>Edit</button>
//                                                     <button onClick={() => handleDelete(row[0])}>Delete</button>
//                                                 </>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// }
// /* - - - - - - - - - - - - - - - - */

/* - - - - - - - - - - - - - - - - */
/* src/app/fxFetchAllData.js | Client-Side Interactivity | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { parse, format, isValid } from 'date-fns';
import './fxStyles.css';

/* - - - - - - - - - - - - - - - - */

// Parse date string in the format 'dd/MM/yyyy HH:mm:ss'
const parseDateString = (dateString) => parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());

// Format date string for display in 'MMM d, yyyy h:mma'
const formatDateForDisplay = (dateString) => {
    const parsedDate = parseDateString(dateString);
    return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy h:mma') : dateString;
};

// Format date string for input in 'yyyy-MM-ddTHH:mm'
const formatDateForInput = (dateString) => {
    const parsedDate = parseDateString(dateString);
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-ddTHH:mm') : '';
};

/* - - - - - - - - - - - - - - - - */

// Ensure headers have at least 5 columns
const ensureHeaders = (headers) => {
    const defaultHeaders = Array.from({ length: 5 }, (_, i) => `Column ${i + 1}`);
    return headers.length >= 5 ? headers : [...headers, ...defaultHeaders.slice(headers.length)];
};

// Pad row to ensure it has 5 columns
const padRow = (row) => [...row, ...Array(5 - row.length).fill('')];

// Group rows by month and year
const groupByMonth = (rows) => {
    return rows.reduce((acc, row) => {
        const parsedDate = parseDateString(row[0]);
        const monthYear = isValid(parsedDate) ? format(parsedDate, 'MMM yyyy') : 'Invalid Dates';
        acc[monthYear] = [...(acc[monthYear] || []), row];
        return acc;
    }, {});
};

// Calculate averages for specified columns
const calculateAverages = (rows, columns) => {
    return columns.map(colIndex => {
        const values = rows.map(row => parseFloat(row[colIndex])).filter(val => !isNaN(val));
        return values.length ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2) : '';
    });
};

/* - - - - - - - - - - - - - - - - */

export default function FxShowAllData({ initialHeaders, initialData }) {
    const [data, setData] = useState(initialData || []);
    const [headers, setHeaders] = useState(initialHeaders || []);
    const [formData, setFormData] = useState(() => {
        const initialForm = Object.fromEntries((initialHeaders || []).map((_, i) => [`col${i}`, '']));
        initialForm.col0 = formatDateForInput(new Date().toISOString()); // Ensure current date-time for col0
        return initialForm;
    });
    const [editingRow, setEditingRow] = useState(null);
    const [editingData, setEditingData] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`/api?cachebuster=${Date.now()}`, { cache: 'no-cache' });
            const { data: result } = await res.json();
            if (Array.isArray(result) && result.length > 0) {
                const [headerRow, ...rows] = result;
                const paddedHeaders = ensureHeaders(headerRow);
                setHeaders(paddedHeaders);
                setData(rows.map(padRow));
                // Ensure formData has current date-time for col0
                setFormData(prevForm => ({ ...prevForm, col0: formatDateForInput(new Date()) }));
            } else {
                const defaultHeaders = ensureHeaders([]);
                setHeaders(defaultHeaders);
                setData([]);
                // Set formData with current date-time for col0
                setFormData(prevForm => ({ ...Object.fromEntries(defaultHeaders.map((_, i) => [`col${i}`, ''])), col0: formatDateForInput(new Date()) }));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // Handle error state here
        }
    }, []);

    useEffect(() => {
        if (!initialData || !initialHeaders) {
            fetchData();
        }
    }, [fetchData, initialData, initialHeaders]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                cache: 'no-cache',
            });
            // Reset formData, ensuring col0 has the current date-time
            setFormData(prevForm => ({ ...Object.fromEntries(headers.map((_, i) => [`col${i}`, ''])), col0: formatDateForInput(new Date()) }));
            fetchData();
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    const handleDelete = async (col0) => {
        try {
            await fetch(`/api?col0=${col0}&cachebuster=${Date.now()}`, {
                method: 'DELETE',
                cache: 'no-cache',
            });
            fetchData();
        } catch (error) {
            console.error('Failed to delete data:', error);
        }
    };

    const handleSave = async (rowData) => {
        try {
            await fetch('/api', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rowData),
                cache: 'no-cache',
            });
            setEditingRow(null);
            setEditingData(null);
            fetchData();
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    const handleInputChange = (e, index, isFormData = true) => {
        const { name, value } = e.target;
        if (isFormData) {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setEditingData(prev => prev.map((cell, j) => j === index ? value : cell));
        }
    };

    const startEditing = (monthYear, rowIndex) => {
        const rowToEdit = groupedData[monthYear][rowIndex];
        setEditingRow(`${monthYear}-${rowIndex}`);
        // Ensure cell0 is correctly formatted
        setEditingData([...rowToEdit.map((cell, index) => index === 0 ? formatDateForInput(cell) : cell)]);
    };

    const cancelEditing = () => {
        setEditingRow(null);
        setEditingData(null);
    };

    const groupedData = useMemo(() => groupByMonth(data), [data]);
    const sortedMonths = useMemo(() => 
        Object.keys(groupedData).sort((a, b) => {
            if (a === 'Invalid Dates') return 1;
            if (b === 'Invalid Dates') return -1;
            return new Date(b) - new Date(a); // Reverse chronological order
        }),
    [groupedData]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                {headers.map((header, index) => (
                    <input
                        key={index}
                        type={index === 0 ? 'datetime-local' : 'text'}
                        name={`col${index}`}
                        placeholder={header}
                        value={formData[`col${index}`] || ''}
                        onChange={e => handleInputChange(e, index)}
                    />
                ))}
                <button type="submit">Add Data</button>
            </form>
            <div className='wrapTable'>
                <table>
                    <thead>
                        <tr>
                            {headers.map((heading, index) => <th key={index}>{heading}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMonths.map((monthYear) => (
                            <React.Fragment key={monthYear}>
                                <tr className='monthHeader'>
                                    <td>{monthYear}</td>
                                    {calculateAverages(groupedData[monthYear], [1, 2]).map((avg, index) => (
                                        <td key={index + 1}>{avg}</td>
                                    ))}
                                    {Array(headers.length - 2).fill().map((_, index) => (
                                        <td key={index + headers.length - 1}></td>
                                    ))}
                                </tr>
                                {groupedData[monthYear].map((row, rowIndex) => (
                                    <tr key={`${monthYear}-${rowIndex}`}>
                                        {headers.map((_, cellIndex) => (
                                            <td key={cellIndex}>
                                                {editingRow === `${monthYear}-${rowIndex}` ? (
                                                    <input
                                                        type={cellIndex === 0 ? 'datetime-local' : 'text'}
                                                        name={`col${cellIndex}`}
                                                        value={editingData[cellIndex] || ''}
                                                        onChange={e => handleInputChange(e, cellIndex, false)}
                                                    />
                                                ) : cellIndex === 0 ? formatDateForDisplay(row[cellIndex]) : row[cellIndex] || ''}
                                            </td>
                                        ))}
                                        <td>
                                            {editingRow === `${monthYear}-${rowIndex}` ? (
                                                <>
                                                    <button onClick={() => handleSave(editingData)}>Save</button>
                                                    <button onClick={cancelEditing}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEditing(monthYear, rowIndex)}>Edit</button>
                                                    <button onClick={() => handleDelete(row[0])}>Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
/* - - - - - - - - - - - - - - - - */