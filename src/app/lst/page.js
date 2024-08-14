// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/lst/page.js | List Page | Sree | 13 Aug 2024 */
// /* - - - - - - - - - - - - - - - - - - - - */

// "use client";

// import React, { useState, useEffect } from 'react';
// import './lst.css';

// const ListPage = () => {
//     const [data, setData] = useState([]);

//     // Fetch the data from the API
//     const fetchData = async () => {
//         try {
//             const response = await fetch('/api');
//             const result = await response.json();
//             if (result.data) {
//                 setData(result.data);
//             } else {
//                 console.error('No data received');
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchData(); // Fetch data on component mount
//     }, []);

//     return (
//         <>
//             <h1>List</h1>
//             {data.length > 0 ? (
//                 data.map((row, index) => (
//                     <div key={index} className="list-item">
//                         {row.map((cell, cellIndex) => (
//                             <span key={cellIndex} className="list-cell">{cell}</span>
//                         ))}
//                     </div>
//                 ))
//             ) : (
//                 <p>No data available</p>
//             )}
//         </>
//     );
// };

// export default ListPage;
// /* - - - - - - - - - - - - - - - - - - - - */




/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/lst/page.js | List Page | Sree | 13 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import { useData } from '../DataContext';

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
