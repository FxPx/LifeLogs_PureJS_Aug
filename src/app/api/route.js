// src/app/api/sheet/route.js

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const { data: { values = [] } } = await sheets.spreadsheets.values.get({
      spreadsheetId: GS_SHEET_ID,
      range: sheetRange,
    });
    return NextResponse.json({ data: values });
  } catch (error) {
    return handleError(error, 'Failed to fetch data');
  }
}

export async function POST(request) {
  try {
    const { col0, col1, col2, col3, col4 = '' } = await request.json();
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: GS_SHEET_ID,
      range: sheetRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[col0, col1, col2, col3, col4]] },
    });
    return NextResponse.json({ message: 'Data added successfully', res });
  } catch (error) {
    return handleError(error, 'Failed to add data');
  }
}

export async function PUT(request) {
  try {
    const { col0, col1, col2, col3, col4 = '' } = await request.json();
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: GS_SHEET_ID,
      range: searchRange,
    });

    const rowIndex = values.findIndex(row => row[0] === col0);
    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    await sheets.spreadsheets.values.update({
      spreadsheetId: GS_SHEET_ID,
      range: `${GS_SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[col0, col1, col2, col3, col4]] },
    });

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    return handleError(error, 'Failed to update data');
  }
}

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
    return handleError(error, 'Failed to delete data');
  }
}
