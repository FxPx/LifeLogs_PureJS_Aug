// /* - - - - - - - - - - - - - - - - */
// /* Root Layout | src/app/layout.js | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// import { Inter } from "next/font/google";
// import "./globals.css";
// import "./FxStyles.css";
// import FxTitleBar from "./bits/fxTitleBar";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "LifeLogs",
//   description: "Logging my readings...",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
//       </head>
//       <body className={inter.className}>
//         <FxTitleBar />
//         <main className="divContent">
//           {children}
//         </main>
//         <footer className="divInputs">
//           <input type="text" placeholder="Type a message..." />
//         </footer>
//       </body>
//     </html>
//   );
// }
// /* - - - - - - - - - - - - - - - - */




// // src/app/layout.js

// import React from 'react';
// import { Inter } from "next/font/google";
// import "./globals.css";
// import "./FxStyles.css";
// import FxTitleBar from "./bits/fxTitleBar";
// import { fetchSheetData } from './api/fxFetchData';

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "LifeLogs",
//   description: "Logging my readings...",
// };

// export default async function RootLayout({ children }) {
//   const initialData = await fetchSheetData();
//   console.log('Initial Data in RootLayout:', initialData); // Add this line

//   return (
//     <html lang="en">
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
//       </head>
//       <body className={inter.className}>
//         <FxTitleBar />
//         <main className="divContent">
//           {React.Children.map(children, (child) => {
//             console.log('Passing initialData to child:', initialData); // Add this line
//             return React.isValidElement(child)
//               ? React.cloneElement(child, { initialData })
//               : child;
//           })}
//         </main>
//         <footer className="divInputs">
//           <input type="text" placeholder="Type a message..." />
//         </footer>
//       </body>
//     </html>
//   );
// }






/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/layout.js | Root Layout | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import "./FxStyles.css";
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