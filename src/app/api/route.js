/* - - - - - - - - - - - - - - - - - - - - */
/* src/app/api/route.js | Calendar Page | Sree | 19 Aug 2024 */
/* - - - - - - - - - - - - - - - - - - - - */

import { google } from 'googleapis';
import { NextResponse } from 'next/server';
export const fetchCache = 'force-no-store'; // Disabling Vercel Data Cache

// Initialize Google Sheets API
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
const searchRange = `${GS_SHEET_NAME}!A:A`;

const handleError = (error, message) => {
  console.error(`${message}:`, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

export { sheets, sheetRange, searchRange, handleError }; // Export configuration and utility functions
/* - - - - - - - - - - - - - - - - - - - - */

// API route handlers
export async function GET() {
  console.log('Now inside route.js - GET...')
  try {
    const timestamp = Date.now();
    const { data: { values = [] } } = await sheets.spreadsheets.values.get({
      spreadsheetId: GS_SHEET_ID,
      range: sheetRange,
      fields: '*',
      prettyPrint: false,
      quotaUser: `user-${timestamp}`,
    }, { cache: 'no-store' });  // For Vercel cache disabling

    return NextResponse.json(
      { data: values, timestamp },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'ETag': `"${timestamp}"`,
        },
      }
    );
  } catch (error) {
    return handleError(error, 'Failed to fetch data');
  }
}
/* - - - - - - - - - - - - - - - - - - - - */

/* Claude gave this solution */
export async function POST(request) {
  try {
    const { col0, col1, col2, col3, col4 = '' } = await request.json();
    console.log('Appending data:', { col0, col1, col2, col3, col4 });

    // First, get the current values in the sheet
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: GS_SHEET_ID,
      range: searchRange,  // Only check column A
    });

    const nextRow = values.length + 1; // Find the next empty row
    const appendRange = `${GS_SHEET_NAME}!A${nextRow}:E${nextRow}`; // Specify the exact range for the new row
    // console.log('Appending to range:', appendRange);

    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: GS_SHEET_ID,
      range: appendRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[col0, col1, col2, col3, col4]] },
    });

    console.log('API Response:', res);
    return NextResponse.json({ message: 'Data added successfully', res });
  } catch (error) {
    console.error('Error adding data:', error);
    return handleError(error, 'Failed to add data');
  }
}
/* - - - - - - - - - - - - - - - - - - - - */

export async function PUT(request) {
  try {
    const { col0, col1, col2, col3, col4 = '' } = await request.json();

    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: GS_SHEET_ID,
      range: searchRange,
    });

    const rowIndex = values.findIndex(row => row[0] === col0);
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: GS_SHEET_ID,
      range: `${GS_SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[col0, col1, col2, col3, col4]] },
    });

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    return handleError(error, 'Failed to update data');
  }
}

/* - - - - - - - - - - - - - - - - - - - - */

export async function DELETE(request) {
  try {
    const col0 = new URL(request.url).searchParams.get('col0');
    if (!col0) return NextResponse.json({ error: 'Missing col0 parameter' }, { status: 400 });

    const [{ data: sheetsData }, { data: { values } }] = await Promise.all([
      sheets.spreadsheets.get({ spreadsheetId: GS_SHEET_ID }),
      sheets.spreadsheets.values.get({ spreadsheetId: GS_SHEET_ID, range: searchRange }),
    ]);

    const sheetId = sheetsData.sheets.find(sheet => sheet.properties.title === GS_SHEET_NAME).properties.sheetId;
    const rowIndex = values.findIndex(row => row[0] === col0);

    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GS_SHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 },
          },
        }],
      },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    return handleError(error, 'Failed to delete data');
  }
}
/* - - - - - - - - - - - - - - - - - - - - */