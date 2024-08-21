/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/api/fxFetchData.js | Fetch GS | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import { sheets, sheetRange } from './route'; // Import from centralized file
export const fetchCache = 'force-no-store';

// Fetch data from Google Sheets
export async function fetchSheetData() {
    console.log('Fetching from Google Sheets…');
    try {
        const { data } = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GS_SHEET_ID,
            range: sheetRange,
            majorDimension: 'ROWS',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            // cache: 'no-store',  // Ensure no Vercel caching
        });
        console.log('Fetched data:', data.values)
        return data.values || [];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return [];
    }
}
/* - - - - - - - - - - - - - - - - - - - - */

/* Append data to Google Sheets */
// export async function appendSheetData(values) {
//     try {
//         const response = await sheets.spreadsheets.values.append({
//             spreadsheetId: process.env.GS_SHEET_ID,
//             range: sheetRange,
//             valueInputOption: 'USER_ENTERED',
//             resource: { values: [values] },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Failed to append data:', error);
//         throw error;
//     }
// }
/* - - - - - - - - - - - - - - - - - - - - */
/* Append data to Google Sheets */
export async function XXXappendSheetData(date, time, fastCol, slowCol, notes) {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GS_SHEET_ID,
            // range: sheetRange,
            range: 'Sheet1!A1', // Ensure this is correctly set to start from Column A

            valueInputOption: 'USER_ENTERED',
            resource: { values: [[date, time, fastCol, slowCol, notes]] },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to append data:', error);
        throw error;
    }
}
