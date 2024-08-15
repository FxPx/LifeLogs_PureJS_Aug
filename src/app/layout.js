/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/layout.js | Root Layout | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import "./fxPatterns.css";
import FxTitleBar from "./bits/fxTitleBar";
import { fetchSheetData } from './api/fxFetchData';
import { DataProvider } from './fxDataContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LifeLogs",
  description: "Logging my readings...",
};

export default async function RootLayout({ children }) {
  const initialData = await fetchSheetData(); // Fetch data from server-side

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <DataProvider initialData={initialData}>
          <FxTitleBar />
          <main className="divContent">
            {children}
          </main>
          <footer className="divInputs">
            <input type="text" placeholder="Type a message..." />
          </footer>
        </DataProvider>
      </body>
    </html>
  );
}

/* - - - - - - - - - - - - - - - - - - - - */