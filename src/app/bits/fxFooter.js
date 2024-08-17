/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/bits/fxFooter.js | FxFooter Component | Sree | 16 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

"use client"
import React, { useRef, useState } from 'react';
import './fxFooter.css';

export default function FxFooter() {
  const saveButtonRef = useRef(null);
  const [isFastChecked, setIsFastChecked] = useState(true);

  const handleKeyDown = event => {
    if (event.key === 'Enter') saveButtonRef.current.click();
  };

  const handleNumberInputChange = () => setIsFastChecked(true);
  
  const handleCheckboxChange = () => setIsFastChecked(prev => !prev);

  return (
    <footer className="divInputs">
      <input type="datetime-local" className="inputDateTime" onKeyDown={handleKeyDown} />
      <label className="checkboxLabel">
        <input type="checkbox" checked={isFastChecked} onChange={handleCheckboxChange} className="checkboxFast" />
        Fast
      </label>
      <input type="number" placeholder="Reading" className="inputNumber" onChange={handleNumberInputChange} onKeyDown={handleKeyDown} />
      <input type="text" placeholder="Notes" className="inputNotes" onKeyDown={handleKeyDown} />
      <button className="saveButton" ref={saveButtonRef}>Save</button>
    </footer>
  );
}
/* - - - - - - - - - - - - - - - - - - - - */