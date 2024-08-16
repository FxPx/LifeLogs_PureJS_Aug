// /* - - - - - - - - - - - - - - - - - - - - */
// /* src/app/api/fxFetchData.js | Fetch Google Sheets | Sree | 14 Aug 2024 */
// /* - - - - - - - - - - - - - - - - - - - - */

// import { google } from 'googleapis';

// const auth = new google.auth.GoogleAuth({
//     credentials: {
//         client_email: process.env.GS_CLIENT_EMAIL,
//         private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     },
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const sheets = google.sheets({ version: 'v4', auth });
// const { GS_SHEET_ID, GS_SHEET_NAME } = process.env;
// const sheetRange = `${GS_SHEET_NAME}!A1:E`;

// export async function fetchSheetData() {
//     console.log('Fetching from Google Sheets');
//     try {
//         const { data } = await sheets.spreadsheets.values.get({
//             spreadsheetId: GS_SHEET_ID,
//             range: sheetRange,
//             headers: {
//                 'Cache-Control': 'no-store', // Disable caching at server level
//             },
//         });
//         return data.values || [];
//     } catch (error) {
//         console.error('Failed to fetch data:', error);
//         return [];
//     }
// }
// /* - - - - - - - - - - - - - - - - - - - - */




/* src/app/api/fxFetchData.js | Fetch Google Sheets | Sree | 16 Aug 2024 */

import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GS_CLIENT_EMAIL,
        private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const { GS_SHEET_ID, GS_SHEET_NAME } = process.env;
const sheetRange = `${GS_SHEET_NAME}!A1:E`;

export async function fetchSheetData() {
    console.log('Fetching from Google Sheets');
    try {
        const { data } = await sheets.spreadsheets.values.get({
            spreadsheetId: GS_SHEET_ID,
            range: sheetRange,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
        return data.values || [];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return [];
    }
}
