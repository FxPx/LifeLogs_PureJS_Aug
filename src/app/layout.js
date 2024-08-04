/* - - - - - - - - - - - - - - - - */
/* Root Layout | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LifeLogs",
  description: "Logging and displaying glucose readings using Google Sheets API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

/* - - - - - - - - - - - - - - - - */
