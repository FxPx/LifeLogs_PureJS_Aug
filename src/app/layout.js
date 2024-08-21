/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/layout.js | Root Layout | Sree | 16 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import "./fxPatterns.css";
import FxTitleBar from "./bits/fxTitleBar";
import FxFooter from "./bits/fxFooter";  // Import FxFooter
import { fetchSheetData } from './api/fxFetchData';
import { DataProvider } from './api/fxDataContext';
export const fetchCache = 'force-no-store'; // Disabling Vercel Data Cache

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LifeLogs",
  description: "Logging my readings...",
};

export default async function RootLayout({ children }) {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // Determine the base URL

  const initialData = await fetchSheetData(baseUrl); // Pass baseUrl to fetchSheetData

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <DataProvider initialData={initialData} key={new Date().getTime()}>
          <FxTitleBar />
          <main className="divContent">
            {children}
          </main>
          <FxFooter />
        </DataProvider>
      </body>
    </html>
  );
}
/* - - - - - - - - - - - - - - - - - - - - */