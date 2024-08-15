/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/fxDataContext.js | Context for Data | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import React, { createContext, useContext } from 'react';

const fxDataContext = createContext();

export function DataProvider({ children, initialData }) {
  return (
    <fxDataContext.Provider value={initialData}>
      {children}
    </fxDataContext.Provider>
  );
}

export function useData() {
  return useContext(fxDataContext);
}
/* - - - - - - - - - - - - - - - - - - - - */