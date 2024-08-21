// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/page.js | Simple Blank Page Template */
// /* - - - - - - - - - - - - - - - - - - - - */
// 'use client';

// import React, { useMemo } from 'react';
// import { useData } from './api/fxDataContext';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// export default function FxShowBarChart() {
//     const initialData = useData();

//     // Group data by month and sort in descending order (latest month first)
//     const groupedData = useMemo(() => {
//         if (!initialData || initialData.length <= 1) return [];

//         const dataByMonth = initialData.slice(1).reduce((acc, row) => {
//             const date = new Date(row[0]); // Temporarily avoid `date-fns` to check for issues
//             const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // Basic date formatting

//             if (!acc[monthKey]) {
//                 acc[monthKey] = [];
//             }

//             acc[monthKey].push({
//                 date: row[0], // Using raw date string to avoid inconsistencies
//                 fasting: Number(row[2]) || 0,
//                 postprandial: Number(row[3]) || 0,
//                 notes: row[4] || '',
//             });

//             return acc;
//         }, {});

//         // Sort the months in descending order
//         return Object.entries(dataByMonth).sort(([a], [b]) => (a > b ? -1 : 1));
//     }, [initialData]);

//     if (groupedData.length === 0) {
//         return <div>No data available</div>;
//     }

//     return (
//         <div>
//             {groupedData.map(([monthKey, data]) => (
//                 <div key={monthKey} style={{ marginBottom: '40px' }}>
//                     <h3>{monthKey}</h3> {/* Displaying raw monthKey for debugging */}
//                     <BarChart width={600} height={300} data={data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="fasting" fill="#8884d8" />
//                         <Bar dataKey="postprandial" fill="#82ca9d" />
//                     </BarChart>
//                 </div>
//             ))}
//         </div>
//     );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { useData } from './api/fxDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function FxShowBarChart() {
    const initialData = useData();

    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        if (initialData && initialData.length > 1) {
            const dataByMonth = initialData.slice(1).reduce((acc, row) => {
                const date = new Date(row[0]);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

                if (!acc[monthKey]) {
                    acc[monthKey] = [];
                }

                acc[monthKey].push({
                    date: row[0],
                    fasting: Number(row[2]) || 0,
                    postprandial: Number(row[3]) || 0,
                    notes: row[4] || '',
                });

                return acc;
            }, {});

            const sortedData = Object.entries(dataByMonth).sort(([a], [b]) => (a > b ? -1 : 1));
            setGroupedData(sortedData);
        }
    }, [initialData]);

    if (groupedData.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div>
            {groupedData.map(([monthKey, data]) => (
                <div key={monthKey} style={{ marginBottom: '40px' }}>
                    <h3>{monthKey}</h3>
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="fasting" fill="#8884d8" />
                        <Bar dataKey="postprandial" fill="#82ca9d" />
                    </BarChart>
                </div>
            ))}
        </div>
    );
}