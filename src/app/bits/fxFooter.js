// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/bits/fxFooter.js | FxFooter Component | Sree | 20 Aug 2024 */
// /* - - - - - - - - - - - - - - - - - - - - */

// "use client";
// import React, { useRef, useState, useEffect } from 'react';
// import './fxFooter.css';

// export const formatDateTime = (dateString) => {
//   const date = new Date(dateString || new Date());
//   return isNaN(date.getTime())
//     ? { date: null, time: null }
//     : {
//       date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
//       time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
//     };
// };

// export default function FxFooter() {
//   const saveButtonRef = useRef(null);
//   const [formData, setFormData] = useState({ dateTime: '', reading: '', isFast: true, notes: '' });
//   const [statusMessage, setStatusMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//       isFast: name === 'reading' ? true : (name === 'isFast' ? checked : prev.isFast)
//     }));
//   };

//   const showToast = (message) => {
//     setStatusMessage(message);
//     setTimeout(() => setStatusMessage(''), 3000);
//   };

//   const handleSave = async () => {
//     if (!formData.reading) return;

//     let { date, time } = formatDateTime(formData.dateTime);
//     if (!date || !time) {
//       const now = new Date();
//       ({ date, time } = formatDateTime(now.toISOString()));
//       setFormData(prev => ({ ...prev, dateTime: now.toISOString().split('.')[0] }));
//     }

//     const fastCol = formData.isFast ? formData.reading : '';
//     const slowCol = formData.isFast ? '' : formData.reading;

//     const requestData = {
//       col0: date,
//       col1: time,
//       col2: fastCol,
//       col3: slowCol,
//       col4: formData.notes
//     };

//     console.log('Sending data:', requestData);

//     try {
//       const response = await fetch('/api/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestData),
//       });

//       // Log the raw response data
//       const responseData = await response.json();
//       console.log('API response:', responseData);

//       if (!response.ok) throw new Error('Failed to save data');

//       setFormData({ dateTime: '', reading: '', isFast: true, notes: '' });
//       showToast('Data saved successfully');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       showToast('Failed to save data');
//     }
//   };


//   return (
//     <footer className="divInputs">
//       {statusMessage && <div className="toastMessage">{statusMessage}</div>}
//       <input
//         type="datetime-local"
//         name="dateTime"
//         placeholder="Log Date-Time…"
//         className="inputDateTime"
//         value={formData.dateTime || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
//         onChange={handleChange}
//         onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
//       />
//       <input
//         type="number"
//         name="reading"
//         placeholder="Reading…"
//         className="inputNumber"
//         value={formData.reading}
//         onChange={handleChange}
//         onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
//       />
//       <label className="checkboxLabel">
//         <input
//           type="checkbox"
//           name="isFast"
//           checked={formData.isFast}
//           onChange={handleChange}
//           className="checkboxFast"
//         />
//         Fast
//       </label>
//       <input
//         type="text"
//         name="notes"
//         placeholder="Notes"
//         className="inputText"
//         value={formData.notes}
//         onChange={handleChange}
//         onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
//       />
//       <button className="saveButton" ref={saveButtonRef} onClick={handleSave}>Save</button>
//     </footer>
//   );
// }
// /* - - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/bits/fxFooter.js | FxFooter Component | Sree | 20 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";
import React, { useRef, useState } from 'react';
import './fxFooter.css';

export const formatDateTime = (dateString) => {
  const date = new Date(dateString || Date.now());
  return {
    date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
};

const sanitizeAndValidate = (input) => {
  const trimmed = typeof input === 'string' ? input.trim() : input;
  return { value: trimmed, isValid: trimmed.length > 0 };
};

const useFormData = (initialState) => {
  const [data, setData] = useState(initialState);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      isFast: name === 'reading' ? true : (name === 'isFast' ? checked : prev.isFast)
    }));
  };
  return [data, handleChange, setData];
};

export default function FxFooter() {
  const saveButtonRef = useRef(null);
  const [formData, handleChange, setFormData] = useFormData({ dateTime: '', reading: '', isFast: true, notes: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const showToast = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSave = async () => {
    const { value: reading, isValid } = sanitizeAndValidate(formData.reading);
    if (!isValid) return;

    let { date, time } = formatDateTime(formData.dateTime);
    if (!date || !time) {
      const now = new Date();
      ({ date, time } = formatDateTime(now.toISOString()));
      setFormData(prev => ({ ...prev, dateTime: now.toISOString().split('.')[0] }));
    }

    const fastCol = formData.isFast ? reading : '';
    const slowCol = formData.isFast ? '' : reading;

    const requestData = {
      col0: date,
      col1: time,
      col2: fastCol,
      col3: slowCol,
      col4: sanitizeAndValidate(formData.notes).value,
    };

    try {
      const response = await fetch('/api/', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Failed to save data');

      setFormData({ dateTime: '', reading: '', isFast: true, notes: '' });
      showToast('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Failed to save data');
    }
  };

  return (
    <footer className="divInputs">
      {statusMessage && <div className="toastMessage">{statusMessage}</div>}
      <input
        type="datetime-local"
        name="dateTime"
        placeholder="Log Date-Time…"
        className="inputDateTime"
        value={formData.dateTime || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && saveButtonRef.current.click()}
      />
      <input
        type="number"
        name="reading"
        placeholder="Reading…"
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