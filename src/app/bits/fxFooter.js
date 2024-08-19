// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/bits/fxFooter.js | FxFooter Component | Sree | 16 Aug 2024 */
// /* - - - - - - - - - - - - - - - - - - - - */

// "use client"
// import React, { useRef, useState } from 'react';
// import './fxFooter.css';

// export default function FxFooter() {
//   const saveButtonRef = useRef(null);
//   const [isFastChecked, setIsFastChecked] = useState(true);

//   const handleKeyDown = event => {
//     if (event.key === 'Enter') saveButtonRef.current.click();
//   };

//   const handleNumberInputChange = () => setIsFastChecked(true);
  
//   const handleCheckboxChange = () => setIsFastChecked(prev => !prev);

//   return (
//     <footer className="divInputs">
//       <input type="datetime-local" placeholder="Log Date-Time…" className="inputDateTime" onKeyDown={handleKeyDown} />
//       <input type="number" placeholder="Reading" className="inputNumber" onChange={handleNumberInputChange} onKeyDown={handleKeyDown} />
//       <label className="checkboxLabel">
//         <input type="checkbox" checked={isFastChecked} onChange={handleCheckboxChange} className="checkboxFast" />
//         Fast
//       </label>
//       <input type="text" placeholder="Notes" className="inputText" onKeyDown={handleKeyDown} />
//       <button className="saveButton" ref={saveButtonRef}>Save</button>
//     </footer>
//   );
// }
// /* - - - - - - - - - - - - - - - - - - - - */





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

//   const handleSave = async () => {
//     if (!inputValue) return;

//     const values = [dateTimeValue, inputValue, isFastChecked ? 'Fast' : 'Slow', notesValue];

//     try {
//       const response = await fetch('/api/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ col0: values[0], col1: values[1], col2: values[2], col3: values[3] }),
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
"use client";
import React, { useRef, useState } from 'react';
import './fxFooter.css';

export default function FxFooter() {
  const saveButtonRef = useRef(null);
  const [isFastChecked, setIsFastChecked] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [dateTimeValue, setDateTimeValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  const handleKeyDown = event => {
    if (event.key === 'Enter') saveButtonRef.current.click();
  };

  const handleNumberInputChange = (event) => {
    setInputValue(event.target.value);
    setIsFastChecked(true);
  };
  
  const handleCheckboxChange = () => setIsFastChecked(prev => !prev);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    return [formattedDate, formattedTime];
  };

  const handleSave = async () => {
    if (!inputValue || !dateTimeValue) return;

    const [formattedDate, formattedTime] = formatDateTime(dateTimeValue);
    const values = [formattedDate, formattedTime, inputValue, isFastChecked ? 'Fast' : 'Slow', notesValue];

    try {
      const response = await fetch('/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          col0: values[0], // Date
          col1: values[1], // Time
          col2: values[2], // Reading
          col3: values[3], // Speed
          col4: values[4], // Notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      // Clear inputs after successful save
      setInputValue('');
      setDateTimeValue('');
      setNotesValue('');
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      console.log('Failed to save data. Please try again.');
    }
  };

  return (
    <footer className="divInputs">
      <input
        type="datetime-local"
        placeholder="Log Date-Time…"
        className="inputDateTime"
        value={dateTimeValue}
        onChange={(e) => setDateTimeValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="number"
        placeholder="Reading"
        className="inputNumber"
        value={inputValue}
        onChange={handleNumberInputChange}
        onKeyDown={handleKeyDown}
      />
      <label className="checkboxLabel">
        <input
          type="checkbox"
          checked={isFastChecked}
          onChange={handleCheckboxChange}
          className="checkboxFast"
        />
        Fast
      </label>
      <input
        type="text"
        placeholder="Notes"
        className="inputText"
        value={notesValue}
        onChange={(e) => setNotesValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="saveButton" ref={saveButtonRef} onClick={handleSave}>Save</button>
    </footer>
  );
}
