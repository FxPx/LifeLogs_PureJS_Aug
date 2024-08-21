/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/api/fxDataContext.js | Context for Data | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

'use client';

import React, { createContext, useContext } from 'react';
export const fetchCache = 'force-no-store'; // Disabling Vercel Data Cache

const fxDataContext = createContext();

export function DataProvider({ children, initialData }) {
  // console.log('[SSR] Fetched GS Data: ', initialData);
  
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