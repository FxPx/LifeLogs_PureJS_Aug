/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/lst/page.js | List Page | Sree | 13 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client"
import { useState } from 'react';
import { useData } from '../api/fxDataContext';
import './lst.css';

export default function ListPage() {
  const data = useData();
  const [activeRow, setActiveRow] = useState(null);

  if (!data || data.length === 0) {
    return <p className="no-data">No data available</p>;
  }

  const headerRow = ['Date-Time', 'Fasting', 'Postprandial', 'Notes', 'Options'];
  const rows = data.slice(1); // Skipping the header row

  const normalizedRows = rows.map(row => {
    const dateTime = `${row[0] || ''} ${row[1] || ''}`.trim();
    return [ dateTime, row[2] || '', row[3] || '', row[4] || '', ];
  }); // Normalize rows to ensure exactly 4 data columns plus options column

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headerRow.map((header, index) => (
              <th key={index} className="table-header">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {normalizedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="table-cell">{cell}</td>
              ))}
              <td className="table-cell options-cell">
                <span
                  className="material-symbols-outlined"
                  onMouseEnter={() => setActiveRow(rowIndex)}
                  onMouseLeave={() => setActiveRow(null)}
                >
                  more_horiz
                </span>
                {activeRow === rowIndex && (
                  <div className="options-menu">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/* - - - - - - - - - - - - - - - - - - - - */