/* - - - - - - - - - - - - - - - - */
/* API Routes for Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */
import sheets from './googleSheetsConfig';
import { NextResponse } from 'next/server';
/* - - - - - - - - - - - - - - - - */
export async function GET(request) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID,
    range: `${process.env.GS_SHEET_NAME}!A2:E`,
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
  try {
    // Extract the col0 value from the URL search params
    const { searchParams } = new URL(request.url);
    const col0 = searchParams.get('col0');

    if (!col0) {
      console.error('col0 parameter is missing or invalid.');
      return NextResponse.json({ error: 'Missing col0 parameter' }, { status: 400 });
    }

    console.log('DELETE request col0:', col0);

    // Get the sheet ID
    const sheetsResponse = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GS_SHEET_ID
    });
    const sheetId = sheetsResponse.data.sheets.find(sheet => sheet.properties.title === process.env.GS_SHEET_NAME).properties.sheetId;

    // Find the row to delete
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID,
      range: `${process.env.GS_SHEET_NAME}!A2:A`,
    });

    const rowIndex = res.data.values.findIndex(row => row[0] === col0);
    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    console.log(`Deleting row at index: ${rowIndex + 2}`); // +2 because we start from A2 and array is 0-indexed

    const batchUpdateRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GS_SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex + 1, // +1 because we start from A2
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      },
    });

    console.log('Batch update response:', batchUpdateRes.data);
    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Failed to delete data:', error);
    return NextResponse.json({ error: 'Failed to delete data', details: error.message }, { status: 500 });
  }
}
/* - - - - - - - - - - - - - - - - */

// export async function DELETE(request) {
//   const data = await request.json();
//   const { col0 } = data;

//   try {
//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: `${process.env.GS_SHEET_NAME}!A2:A`,
//     });

//     const rowIndex = res.data.values.findIndex(row => row[0] === col0);
//     if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

//     await sheets.spreadsheets.values.update({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: `${process.env.GS_SHEET_NAME}!A${rowIndex + 2}:E${rowIndex + 2}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: { values: [['', '', '', '', '']] },
//     });

//     return NextResponse.json({ message: 'Data deleted successfully' });
//   } catch (error) {
//     console.error('Failed to delete data:', error);
//     return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
//   }
// }
/* - - - - - - - - - - - - - - - - */