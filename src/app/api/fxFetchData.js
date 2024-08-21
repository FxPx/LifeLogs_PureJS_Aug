/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/api/fxFetchData.js | Fetch GS | Sree | 14 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import { sheets, sheetRange } from './route';
export const fetchCache = 'force-no-store';
/* - - - - - - - - - - - - - - - - - - - - */

// Fetch data from Google Sheets
export async function fetchSheetData() {
    console.log('[SSR] Fetching from Google Sheets…');

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
            // cache: 'no-store',  // Vercel No-caching didn't work here
        });

        return data.values || [];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return [];
    }
}
/* - - - - - - - - - - - - - - - - - - - - */