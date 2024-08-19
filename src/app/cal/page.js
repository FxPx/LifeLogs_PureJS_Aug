/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/cal/page.js | Calendar Page | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { useData } from '../api/fxDataContext';
import 'react-calendar/dist/Calendar.css';
import '../cal/cal.css';
/* - - - - - - - - - - - - - - - - - - - - */
const parseDate = dateString => {
    const parts = dateString.split('/');
    return parts.length === 3 ? new Date(parts[2], parts[0] - 1, parts[1]) : null;
};
/* - - - - - - - - - - - - - - - - - - - - */
const getDotColor = (value, [min, max]) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= min && numValue <= max ? 'var(--clrGood)' : 'var(--clrBad)';
};
/* - - - - - - - - - - - - - - - - - - - - */
const logConfig = [
    { index: 2, colorRange: [80, 130], label: ' F' },
    { index: 3, colorRange: [0, 180], label: ' P' }
];
/* - - - - - - - - - - - - - - - - - - - - */
export default function fxShowCalendar() {
    const initialData = useData();
    const [selectedDate, setSelectedDate] = useState(null);

    const { logMap, calendarMonths } = useMemo(() => {
        if (!Array.isArray(initialData) || initialData.length <= 1) {
            console.error('Invalid or empty data');
            return { logMap: new Map(), calendarMonths: [] };
        }

        const logMap = new Map(initialData.slice(1).map(row => [row[0], row]));
        const dates = Array.from(logMap.keys()).map(parseDate).filter(Boolean);

        if (dates.length === 0) {
            console.error('No valid dates found in the data');
            return { logMap: new Map(), calendarMonths: [] };
        }

        const [minDate, maxDate] = [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
        const calendarMonths = [];
        for (let d = new Date(minDate.getFullYear(), minDate.getMonth(), 1); d <= maxDate; d.setMonth(d.getMonth() + 1)) {
            calendarMonths.push(new Date(d));
        }

        return { logMap, calendarMonths: calendarMonths.reverse() };
    }, [initialData]);

    const tileClassName = ({ date }) => logMap.has(date.toLocaleDateString('en-US')) ? 'highlight' : 'empty';

    const tileContent = ({ date }) => {
        const log = logMap.get(date.toLocaleDateString('en-US'));
        if (!log) return null;

        return (
            <div className="dot-container">
                {logConfig.map(({ index, colorRange }, i) =>
                    log[index] && (
                        <span
                            key={i}
                            className="dot"
                            style={{ backgroundColor: getDotColor(log[index], colorRange) }}
                        />
                    )
                )}
            </div>
        );
    };
    /* - - - - - - - - - - - - - - - - - - - - */
    const handleDayClick = date => setSelectedDate(prev => prev?.getTime() === date.getTime() ? null : date);
    /* - - - - - - - - - - - - - - - - - - - - */

    // const renderLogDetails = (log) => {
    //     if (!log) return null;

    //     return (
    //         <div className="divWrapLog">
    //             <span className="log-values">
    //                 {logConfig.map(({ index, label }) => log[index] && `${log[index]}${label}`).filter(Boolean).join(', ')}
    //             </span>
    //             {log[4] && (
    //                 <div className="log-comments">
    //                     {log[4]}
    //                     <span
    //                         className="material-symbols-outlined close-icon"
    //                         onClick={() => setSelectedDate(null)}
    //                     >
    //                         close
    //                     </span>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };
    const renderLogDetails = (log) => {
        if (!log) return null;

        return (
            <div className="divWrapLog">
                <span className="log-values">
                    {logConfig.map(({ index, label }) => log[index] && `${log[index]}${label}`).filter(Boolean).join(', ')}
                </span>
                <div className="log-comments">
                    {log[4] && (<span> {log[4]} </span>)}
                    {/* If log[4] has a value, it will be rendered inside a <span>. */}
                    <span
                        className="material-symbols-outlined close-icon"
                        onClick={() => setSelectedDate(null)}
                    >
                        close
                    </span>
                </div>
            </div>
        );
    };

    if (calendarMonths.length === 0) {
        return <div>No data available to display calendar.</div>;
    }

    return (
        <div className="calendarGrid">
            {calendarMonths.map((monthDate, index) => (
                <div key={index} className="monthCalendar">
                    <p>{monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    {selectedDate && selectedDate.getMonth() === monthDate.getMonth() &&
                        renderLogDetails(logMap.get(selectedDate.toLocaleDateString('en-US')))}
                    <Calendar
                        defaultActiveStartDate={monthDate}
                        tileClassName={tileClassName}
                        tileContent={tileContent}
                        minDetail="month"
                        maxDetail="month"
                        showNavigation={false}
                        onClickDay={handleDayClick}
                        value={selectedDate}
                    />
                </div>
            ))}
        </div>
    );
}
/* - - - - - - - - - - - - - - - - - - - - */