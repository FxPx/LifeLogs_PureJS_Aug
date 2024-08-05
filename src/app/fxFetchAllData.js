/* - - - - - - - - - - - - - - - - */
/* src/app/fxFetchAllData.js | Client-Side Interactivity | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { parse, format, isValid } from 'date-fns';
import './FxStyles.css';

const formatDate = (dateString) => {
    const parsedDate = parse(dateString, 'M/d/yyyy h:mma', new Date());
    return isValid(parsedDate) ? format(parsedDate, 'dd MMM') : dateString;
};

const ensureHeaders = (headers) => {
    const defaultHeaders = Array.from({ length: 5 }, (_, i) => `Column ${i + 1}`);
    return headers.length >= 5 ? headers : [...headers, ...defaultHeaders.slice(headers.length)];
};

const padRow = (row) => [...row, ...Array(5 - row.length).fill('')];

const groupByMonth = (rows) => {
    return rows.reduce((acc, row) => {
        const parsedDate = parse(row[0], 'M/d/yyyy h:mma', new Date());
        const monthYear = isValid(parsedDate) ? format(parsedDate, 'MMM yyyy') : 'Invalid Dates';
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(row);
        return acc;
    }, {});
};

const calculateAverages = (rows) => {
    const sums = [0, 0];
    const counts = [0, 0];
    rows.forEach(row => {
        [1, 2].forEach(index => {
            const value = parseFloat(row[index]);
            if (!isNaN(value)) {
                sums[index - 1] += value;
                counts[index - 1]++;
            }
        });
    });
    return sums.map((sum, index) => counts[index] ? (sum / counts[index]).toFixed(2) : '');
};

export default function FxShowAllData({ initialHeaders, initialData, initialFormData }) {
    const [data, setData] = useState(initialData || []);
    const [headers, setHeaders] = useState(initialHeaders || []);
    const [formData, setFormData] = useState(initialFormData || {});
    const [editingRow, setEditingRow] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`/api?cachebuster=${Date.now()}`, { cache: 'no-cache' });
            const { data: result } = await res.json();
            if (Array.isArray(result) && result.length > 0) {
                const [headerRow, ...rows] = result;
                const paddedHeaders = ensureHeaders(headerRow);
                setHeaders(paddedHeaders);
                setData(rows.map(padRow));
                setFormData(Object.fromEntries(paddedHeaders.map((_, i) => [`col${i}`, ''])));
            } else {
                const defaultHeaders = ensureHeaders([]);
                setData([]);
                setHeaders(defaultHeaders);
                setFormData(Object.fromEntries(defaultHeaders.map((_, i) => [`col${i}`, ''])));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            const defaultHeaders = ensureHeaders([]);
            setData([]);
            setHeaders(defaultHeaders);
            setFormData(Object.fromEntries(defaultHeaders.map((_, i) => [`col${i}`, ''])));
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
            setFormData(Object.fromEntries(headers.map((_, i) => [`col${i}`, ''])));
            fetchData();
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    const handleDelete = async (col0) => {
        try {
            await fetch(`/api?col0=${col0}&cachebuster=${Date.now()}`, { method: 'DELETE', cache: 'no-cache' });
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
            fetchData();
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    const handleInputChange = (e, index, isFormData = true) => {
        const { name, value } = e.target;
        isFormData
            ? setFormData(prev => ({ ...prev, [name]: value }))
            : setData(prev => prev.map((row, i) =>
                i === editingRow ? row.map((cell, j) => j === index ? value : cell) : row
            ));
    };

    const groupedData = groupByMonth(data);
    const sortedMonths = Object.keys(groupedData).sort((a, b) => {
        if (a === 'Invalid Dates') return 1;
        if (b === 'Invalid Dates') return -1;
        return new Date(a) - new Date(b);
    });

    return (
        <>
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
                                    {calculateAverages(groupedData[monthYear]).map((avg, index) => (
                                        <td key={index} className='averageColumn'>{avg}</td>
                                    ))}
                                    {Array(headers.length - 2).fill().map((_, index) => (
                                        <td key={index + 2}></td>
                                    ))}
                                </tr>
                                {groupedData[monthYear].map((row, rowIndex) => (
                                    <tr key={`${monthYear}-${rowIndex}`}>
                                        {headers.map((_, cellIndex) => (
                                            <td key={cellIndex}>
                                                {editingRow === `${monthYear}-${rowIndex}` ? (
                                                    <input
                                                        type="text"
                                                        name={`col${cellIndex}`}
                                                        value={row[cellIndex] || ''}
                                                        onChange={e => handleInputChange(e, cellIndex, false)}
                                                    />
                                                ) : cellIndex === 0 ? formatDate(row[cellIndex]) : row[cellIndex] || ''}
                                            </td>
                                        ))}
                                        <td>
                                            {editingRow === `${monthYear}-${rowIndex}` ? (
                                                <>
                                                    <button onClick={() => handleSave(row)}>Save</button>
                                                    <button onClick={() => setEditingRow(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setEditingRow(`${monthYear}-${rowIndex}`)}>Edit</button>
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