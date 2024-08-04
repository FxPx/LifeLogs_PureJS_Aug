/* - - - - - - - - - - - - - - - - */
/* API Routes for Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import sheets from './googleSheetsConfig';
import { NextResponse } from 'next/server';
/* - - - - - - - - - - - - - - - - */

export async function GET(request) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID,
    range: `${process.env.GS_SHEET_NAME}!A2:D`,
  });

  const data = res.data.values || [];
  return NextResponse.json({ data });
}
/* - - - - - - - - - - - - - - - - */

export async function POST(request) {
  const data = await request.json();
  const { col0, col1, col2, col3, col4 } = data;

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GS_SHEET_ID,
    range: `${process.env.GS_SHEET_NAME}!A:E`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [[col0, col1, col2, col3, col4 || '']] },
  });

  return NextResponse.json({ message: 'Data added successfully', res });
}
/* - - - - - - - - - - - - - - - - */

export async function PUT(request) {
  const data = await request.json();
  const { col0, col1, col2, col3, col4 } = data;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID,
      range: `${process.env.GS_SHEET_NAME}!A2:A`,
    });

    const rowIndex = res.data.values.findIndex(row => row[0] === col0);
    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    const values = [col0, col1, col2, col3, col4 || ''];
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GS_SHEET_ID,
      range: `${process.env.GS_SHEET_NAME}!A${rowIndex + 2}:E${rowIndex + 2}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Failed to update data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
/* - - - - - - - - - - - - - - - - */

export async function DELETE(request) {
  const data = await request.json();
  const { col0 } = data;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID,
      range: `${process.env.GS_SHEET_NAME}!A2:A`,
    });

    const rowIndex = res.data.values.findIndex(row => row[0] === col0);
    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GS_SHEET_ID,
      range: `${process.env.GS_SHEET_NAME}!A${rowIndex + 2}:E${rowIndex + 2}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [['', '', '', '', '']] },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Failed to delete data:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
/* - - - - - - - - - - - - - - - - */