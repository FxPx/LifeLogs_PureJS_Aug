/* - - - - - - - - - - - - - - - - */
/* Root Layout | src/app/layout.js | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import { Inter } from "next/font/google";
import "./globals.css";
import "./fxStyles.css";
import FxTitleBar from "./bits/fxTitleBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LifeLogs",
  description: "Logging my readings...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <FxTitleBar />
        <main className="divContent">
          {children}
        </main>
        <footer className="divInputs">
          <input type="text" placeholder="Type a message..." />
        </footer>
      </body>
    </html>
  );
}
/* - - - - - - - - - - - - - - - - */