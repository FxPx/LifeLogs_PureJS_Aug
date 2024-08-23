// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/page.js | Simple Blank Page Template */
// /* - - - - - - - - - - - - - - - - - - - - */

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useData } from './api/fxDataContext';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
// import './bits/trends.css';

// export default function FxShowBarChart() {
//     const initialData = useData();
//     const [groupedData, setGroupedData] = useState([]);

//     useEffect(() => {
//         if (initialData && initialData.length > 1) {
//             const dataByMonth = initialData.slice(1).reduce((acc, row) => {
//                 const date = new Date(row[0]);
//                 const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

//                 if (!acc[monthKey]) {
//                     acc[monthKey] = Array.from({ length: 31 }, (_, i) => ({
//                         date: i + 1,
//                         fasting: 0,
//                         postprandial: 0,
//                         notes: '',
//                         hasData: false,  // Track if this day has actual data
//                     }));
//                 }

//                 const day = date.getDate() - 1;
//                 acc[monthKey][day] = {
//                     date: day + 1,
//                     fasting: Number(row[2]) || 0,
//                     postprandial: Number(row[3]) || 0,
//                     notes: row[4] || '',
//                     hasData: true, // Indicate that this day has data
//                 };

//                 return acc;
//             }, {});

//             const sortedData = Object.entries(dataByMonth).sort(([a], [b]) => (a > b ? -1 : 1));
//             setGroupedData(sortedData);
//         }
//     }, [initialData]);

//     if (groupedData.length === 0) {
//         return <div>No data available</div>;
//     }

//     return (
//         <div>
//             {groupedData.map(([monthKey, data]) => (
//                 <div key={monthKey} style={{ marginBottom: '40px' }}>
//                     <h3 style={{ marginBottom: '16px' }}>{monthKey}</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={data} margin={{ top: 24, right: 0, bottom: 0, left: -24 }}>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                             <XAxis
//                                 dataKey="date"
//                                 ticks={[1, 8, 15, 22, 29]}
//                                 interval={0}
//                                 tick={{ fontSize: 12 }} // Control tick font size
//                             />
//                             <YAxis
//                                 tick={{ fontSize: 12 }} // Reduce Y-axis font size
//                             />
//                             <Tooltip />
//                             <Bar
//                                 dataKey="date"
//                                 fill="#d3d3d3"
//                                 stackId="a"
//                                 barSize={20}
//                                 background={{ fill: '#f0f0f0' }}
//                                 hide={data.some(d => d.hasData)}
//                             /> {/* Light-gray bars for days without data */}
//                             <Bar
//                                 dataKey="fasting"
//                                 fill="#3868d0"
//                                 stackId="a"
//                                 barSize={20}
//                             />
//                             <Bar
//                                 dataKey="postprandial"
//                                 fill="#ff9900"
//                                 stackId="a"
//                                 barSize={20}
//                             />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             ))}
//         </div>
//     );

// }
// /* - - - - - - - - - - - - - - - - - - - - */
'use client';

import React, { useState, useEffect } from 'react';
import { useData } from './api/fxDataContext';
import {     BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import './bits/trends.css';

export default function FxShowBarChart() {
    const initialData = useData();
    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        if (initialData && initialData.length > 1) {
            const dataByMonth = initialData.slice(1).reduce((acc, row) => {
                const date = new Date(row[0]);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

                if (!acc[monthKey]) {
                    acc[monthKey] = Array.from({ length: 31 }, (_, i) => ({
                        date: i + 1,
                        fasting: 0,
                        postprandial: 0,
                        notes: '',
                        hasData: false,  // Track if this day has actual data
                    }));
                }

                const day = date.getDate() - 1;
                acc[monthKey][day] = {
                    date: day + 1,
                    fasting: Number(row[2]) || 0,
                    postprandial: Number(row[3]) || 0,
                    notes: row[4] || '',
                    hasData: true, // Indicate that this day has data
                };

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
            {groupedData.map(([monthKey, data]) => {
                const fastingAvg = data.reduce((sum, entry) => sum + entry.fasting, 0) / data.length;
                const postprandialAvg = data.reduce((sum, entry) => sum + entry.postprandial, 0) / data.length;
    
                return (
                    <div key={monthKey} style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '16px' }}>{monthKey}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data} margin={{ top: 24, right: 0, bottom: 0, left: -24 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    ticks={[1, 8, 15, 22, 29]}
                                    interval={0}
                                    tick={{ fontSize: 12 }} // Control tick font size
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }} // Reduce Y-axis font size
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="date"
                                    fill="#d3d3d3"
                                    stackId="a"
                                    barSize={20}
                                    background={{ fill: '#f0f0f0' }}
                                    hide={data.some(d => d.hasData)}
                                /> {/* Light-gray bars for days without data */}
                                <Bar
                                    dataKey="fasting"
                                    fill="#3868d0"
                                    stackId="a"
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="postprandial"
                                    fill="#ff9900"
                                    stackId="a"
                                    barSize={20}
                                />
                                <ReferenceLine y={fastingAvg} stroke="#3868d0" strokeDasharray="3 3" /> {/* Fasting average line */}
                                <ReferenceLine y={postprandialAvg} stroke="#ff9900" strokeDasharray="3 3" /> {/* Postprandial average line */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            })}
        </div>
    );
}