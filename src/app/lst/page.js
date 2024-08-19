/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/lst/page.js | List Page | Sree | 13 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import { useData } from '../api/fxDataContext';

export default function ListPage() {
  const initialData = useData(); // Access data from context

  if (!initialData || initialData.length === 0) {
    return <p>No data available</p>;
  }

  const [headerRow, ...rows] = initialData;

  return (
    <div>
      <h1>List Page</h1>
      <table>
        <thead>
          <tr>
            {headerRow.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/* - - - - - - - - - - - - - - - - - - - - */