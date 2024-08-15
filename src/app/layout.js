/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/layout.js | Root Layout | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import "./fxPatterns.css";
import FxTitleBar from "./bits/fxTitleBar";
import { fetchSheetData } from './api/fxFetchData';
import { DataProvider } from './DataContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LifeLogs",
  description: "Logging my readings...",
};

export default async function RootLayout({ children }) {
  const initialData = await fetchSheetData(); // Fetch data server-side

  return (
    <html lang="en">
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