/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/cal/page.js | Calendar Page | Sree | 12 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../cal/cal.css';

const fxCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

    // Check if a date is the same as today
    const isSameDay = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    return (
        <>
            <h1>{year} Calendar</h1>
            <div className="calendarGrid">
                {months.map((monthDate, index) => (
                    <div key={index} className="monthCalendar">
                        <h4>{monthDate.toLocaleString('default', { month: 'long' })}</h4>
                        <Calendar
                            defaultActiveStartDate={monthDate}
                            tileClassName={({ date, view }) =>
                                view === 'month' && isSameDay(date) ? 'highlight-today' : null
                            }
                            minDetail="month"
                            maxDetail="month"
                            showNavigation={false} // Hide navigation controls
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default fxCalendar;
/* - - - - - - - - - - - - - - - - - - - - */