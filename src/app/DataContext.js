/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/DataContext.js | Context for Data | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children, initialData }) {
  return (
    <DataContext.Provider value={initialData}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
/* - - - - - - - - - - - - - - - - - - - - */