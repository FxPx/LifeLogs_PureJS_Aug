// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/page.js | Simple Blank Page Template */
// /* - - - - - - - - - - - - - - - - - - - - */

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useData } from './api/fxDataContext';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceArea, Label } from 'recharts';
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

//     // Declare colors and other constants at the top
//     const colors = {
//         fastingBar: "#3868d0",
//         postprandialBar: "#ff9900",
//         dateBar: "#d3d3d3",
//         dateBarBg: "##f0f0f0",
//         fastingRange: "#b3e5fc",
//         ppLimitLine: "#ff0000",
//         xAxisLine: "#B8BBBE",
//         yAxisLine: "#8A8D90",
//         labelColor: "#ff0000"
//     };

//     return (
//         <div>
//             {groupedData.map(([monthKey, data]) => {
//                 const maxFasting = Math.max(...data.map(entry => entry.fasting || 0));
//                 const maxPostprandial = Math.max(...data.map(entry => entry.postprandial || 0));
//                 const maxValue = Math.max(maxFasting, maxPostprandial);

//                 return (
//                     <div key={monthKey} style={{ marginBottom: '40px' }}>
//                         <h3 style={{ marginBottom: '16px' }}>{monthKey}</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={data} margin={{ top: 24, right: 0, bottom: 0, left: -24 }}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                                 <XAxis
//                                     dataKey="date"
//                                     ticks={[1, 8, 15, 22, 29]}
//                                     interval={0}
//                                     tick={{ fontSize: 12, fill: colors.fastingBar }} // Set the X-axis text color
//                                     stroke={colors.xAxisLine} // Use red color for X-axis line
//                                 />
//                                 <YAxis
//                                     tick={{ fontSize: 12, fill: colors.postprandialBar }} // Set the Y-axis text color
//                                     domain={[0, maxValue]} // Limit Y-axis to the maximum value for the month
//                                     stroke={colors.yAxisLine} // Use red color for Y-axis line
//                                 />
//                                 <Tooltip />

//                                 {/* ReferenceArea for fasting range (80-130) */}
//                                 <ReferenceArea y1={80} y2={130} fill={colors.fastingRange} fillOpacity={0.3} />

//                                 {/* ReferenceLine for postprandial limit (200) */}
//                                 <ReferenceLine y={200} stroke={colors.ppLimitLine} strokeDasharray="4 4">
//                                     <Label
//                                         value="PP Limit: 200"
//                                         position="right"
//                                         offset={10}
//                                         fill={colors.labelColor}
//                                         fontSize={12}
//                                     />
//                                 </ReferenceLine>

//                                 <Bar
//                                     dataKey="date"
//                                     fill={colors.dateBar}
//                                     stackId="a"
//                                     barSize={20}
//                                     background={{ fill: colors.dateBarBg }}
//                                     hide={data.some(d => d.hasData)}
//                                 /> {/* Light-gray bars for days without data */}
//                                 <Bar
//                                     dataKey="fasting"
//                                     fill={colors.fastingBar}
//                                     stackId="a"
//                                     barSize={20}
//                                 />
//                                 <Bar
//                                     dataKey="postprandial"
//                                     fill={colors.postprandialBar}
//                                     stackId="a"
//                                     barSize={20}
//                                 />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }
// /* - - - - - - - - - - - - - - - - - - - - */
'use client';

import React, { useMemo } from 'react';
import { useData } from './api/fxDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceArea, Label, Cell } from 'recharts';
import './bits/trends.css';

const colors = {
  normalFasting: "#3868d0",
  normalPostprandial: "#ff9900",
  warning: "#c81910",
  dateBar: "#d3d3d3",
  dateBarBg: "#f0f0f0",
  fastingRange: "#b3e5fc",
  ppLimitLine: "#ff0000",
  xAxisLine: "#B8BBBE",
  yAxisLine: "#8A8D90",
  labelColor: "#ff0000"
};

const getFastingBarColor = (fasting) => {
  return fasting >= 80 && fasting <= 130 ? colors.normalFasting : colors.warning;
};

const getPPBarColor = (postprandial) => {
  return postprandial <= 200 ? colors.normalPostprandial : colors.warning;
};

export default function FxShowBarChart() {
  const initialData = useData();

  const groupedData = useMemo(() => {
    if (!initialData || initialData.length <= 1) return [];

    const dataByMonth = initialData.slice(1).reduce((acc, [dateStr, , fasting, postprandial, notes]) => {
      const date = new Date(dateStr);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = Array(31).fill().map((_, i) => ({
          date: i + 1,
          fasting: 0,
          postprandial: 0,
          notes: '',
          hasData: false,
        }));
      }

      acc[monthKey][date.getDate() - 1] = {
        date: date.getDate(),
        fasting: Number(fasting) || 0,
        postprandial: Number(postprandial) || 0,
        notes: notes || '',
        hasData: true,
      };

      return acc;
    }, {});

    return Object.entries(dataByMonth).sort(([a], [b]) => b.localeCompare(a));
  }, [initialData]);

  if (groupedData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {groupedData.map(([monthKey, data]) => {
        const maxFasting = Math.max(...data.map(entry => entry.fasting || 0));
        const maxPostprandial = Math.max(...data.map(entry => entry.postprandial || 0));
        const maxValue = Math.max(maxFasting, maxPostprandial);

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
                  tick={{ fontSize: 12, fill: colors.normalFasting }}
                  stroke={colors.xAxisLine}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: colors.normalPostprandial }}
                  domain={[0, maxValue]}
                  stroke={colors.yAxisLine}
                />
                <Tooltip />
                <ReferenceArea y1={80} y2={130} fill={colors.fastingRange} fillOpacity={0.3} />
                <ReferenceLine y={200} stroke={colors.ppLimitLine} strokeDasharray="4 4">
                  <Label
                    value="PP Limit: 200"
                    position="right"
                    offset={10}
                    fill={colors.labelColor}
                    fontSize={12}
                  />
                </ReferenceLine>
                <Bar
                  dataKey="fasting"
                  stackId="a"
                  barSize={20}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getFastingBarColor(entry.fasting)} />
                  ))}
                </Bar>
                <Bar
                  dataKey="postprandial"
                  stackId="a"
                  barSize={20}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getPPBarColor(entry.postprandial)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
