/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/bits/fxFooter.js | FxFooter Component | Sree | 20 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client";
import React, { useRef, useState } from 'react';
import './fxFooter.css';

export const formatDateTime = (dateString) => {
  const date = new Date(dateString || new Date());
  return isNaN(date.getTime())
    ? { date: null, time: null }
    : {
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
};
/* - - - - - - - - - - - - - - - - - - - - */

export default function FxFooter() {
  const saveButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    dateTime: '',
    reading: '',
    isFast: true,
    notes: ''
  });
  /* - - - - - - - - - - - - - - - - - - - - */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      isFast: name === 'reading' ? true : (name === 'isFast' ? checked : prev.isFast)
    }));
  };
  /* - - - - - - - - - - - - - - - - - - - - */

  const handleSave = async () => {
    if (!formData.reading) return;

    let { date, time } = formatDateTime(formData.dateTime);

    if (!date || !time) {
      const now = new Date();
      ({ date, time } = formatDateTime(now.toISOString()));
      setFormData(prev => ({ ...prev, dateTime: now.toISOString().split('.')[0] }));
    }

    const fastCol = formData.isFast ? formData.reading : '';
    const slowCol = formData.isFast ? '' : formData.reading;

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
      console.log('Google Sheets: Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      console.log('Google Sheets: Failed to save data...');
    }
  };

  return (
    <footer className="divInputs">
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
/* - - - - - - - - - - - - - - - - - - - - */