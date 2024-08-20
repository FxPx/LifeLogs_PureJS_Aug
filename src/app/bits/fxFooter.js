// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/bits/fxFooter.js | FxFooter Component | Sree | 16 Aug 2024 */
// /* - - - - - - - - - - - - - - - - - - - - */

// "use client";
// import React, { useRef, useState } from 'react';
// import './fxFooter.css';

// export default function FxFooter() {
//   const saveButtonRef = useRef(null);
//   const [isFastChecked, setIsFastChecked] = useState(true);
//   const [inputValue, setInputValue] = useState('');
//   const [dateTimeValue, setDateTimeValue] = useState('');
//   const [notesValue, setNotesValue] = useState('');

//   const handleKeyDown = event => {
//     if (event.key === 'Enter') saveButtonRef.current.click();
//   };

//   const handleNumberInputChange = (event) => {
//     setInputValue(event.target.value);
//     setIsFastChecked(true);
//   };

//   const handleCheckboxChange = () => setIsFastChecked(prev => !prev);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     let hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     return `${hours}:${minutes}${ampm}`;
//   };

//   const handleSave = async () => {
//     if (!inputValue) return;

//     const date = formatDate(dateTimeValue);
//     const time = formatTime(dateTimeValue);

//     const values = [date, time, inputValue, isFastChecked ? 'Fast' : 'Slow', notesValue];

//     try {
//       const response = await fetch('/api/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           col0: values[0], // Date
//           col1: values[1], // Time
//           col2: values[2], // Input Value
//           col3: values[3], // Speed (Fast/Slow)
//           col4: values[4], // Notes
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save data');
//       }

//       // Clear inputs after successful save
//       setInputValue('');
//       setDateTimeValue('');
//       setNotesValue('');
//       alert('Data saved successfully!');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Failed to save data. Please try again.');
//     }
//   };

//   return (
//     <footer className="divInputs">
//       <input
//         type="datetime-local"
//         placeholder="Log Date-Time…"
//         className="inputDateTime"
//         value={dateTimeValue}
//         onChange={(e) => setDateTimeValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//       />
//       <input
//         type="number"
//         placeholder="Reading"
//         className="inputNumber"
//         value={inputValue}
//         onChange={handleNumberInputChange}
//         onKeyDown={handleKeyDown}
//       />
//       <label className="checkboxLabel">
//         <input
//           type="checkbox"
//           checked={isFastChecked}
//           onChange={handleCheckboxChange}
//           className="checkboxFast"
//         />
//         Fast
//       </label>
//       <input
//         type="text"
//         placeholder="Notes"
//         className="inputText"
//         value={notesValue}
//         onChange={(e) => setNotesValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//       />
//       <button className="saveButton" ref={saveButtonRef} onClick={handleSave}>Save</button>
//     </footer>
//   );
// }
// /* - - - - - - - - - - - - - - - - - - - - */






/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/bits/fxFooter.js | FxFooter Component | Sree | 16 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";
import React, { useRef, useState } from 'react';
import './fxFooter.css';

export default function FxFooter() {
  const saveButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    dateTime: '',
    reading: '',
    isFast: true,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Only set isFast to true when reading changes if it's not the checkbox being changed
      isFast: name === 'reading' ? true : (name === 'isFast' ? checked : prev.isFast)
    }));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString || new Date());
    if (isNaN(date.getTime())) return { date: null, time: null };

    return {
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const handleSave = async () => {
    if (!formData.reading) return;

    let { date, time } = formatDateTime(formData.dateTime);
    
    if (!date || !time) {
      const now = new Date();
      const defaultDateTime = formatDateTime(now);
      date = defaultDateTime.date;
      time = defaultDateTime.time;
      setFormData(prev => ({ ...prev, dateTime: now.toISOString().split('.')[0] }));
    }

    const fastCol = formData.isFast ? formData.reading : '';
    const slowCol = !formData.isFast ? formData.reading : '';

    try {
      const response = await fetch('/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          col0: date,
          col1: time,
          col2: fastCol,
          col3: slowCol,
          col4: formData.notes
        }),
      });

      if (!response.ok) throw new Error('Failed to save data');

      setFormData({ dateTime: '', reading: '', isFast: true, notes: '' });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <footer className="divInputs">
      <input
        type="datetime-local"
        name="dateTime"
        placeholder="Log Date-Time…"
        className="inputDateTime"
        value={formData.dateTime}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
      />
      <input
        type="number"
        name="reading"
        placeholder="Reading"
        className="inputNumber"
        value={formData.reading}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
      />
      <label className="checkboxLabel">
        <input
          type="checkbox"
          name="isFast"
          checked={formData.isFast}
          onChange={handleChange}
          className="checkboxFast"
        />
        Fast
      </label>
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        className="inputText"
        value={formData.notes}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
      />
      <button className="saveButton" ref={saveButtonRef} onClick={handleSave}>Save</button>
    </footer>
  );
}
/* - - - - - - - - - - - - - - - - - - - - */