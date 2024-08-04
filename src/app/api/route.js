//     /* - - - - - - - - - - - - - - - - */
// /* route.js | API Routes for Google Sheets | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */

// import sheets from './googleSheetsConfig';
// import { NextResponse } from 'next/server';

// const sheetRange = `${process.env.GS_SHEET_NAME}!A1:E`;
// const searchRange = `${process.env.GS_SHEET_NAME}!A:A`;

// /* - - - - - - - - - - - - - - - - */
// /* Handle GET requests to fetch data from Google Sheets | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */
// export async function GET(request) {
//   try {
//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: sheetRange,
//     });
//     const data = res.data.values || [];
//     return NextResponse.json({ data });
//   } catch (error) {
//     console.error('Failed to fetch data:', error);
//     return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//   }
// }

// /* - - - - - - - - - - - - - - - - */
// /* Handle POST requests to add data to Google Sheets | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */
// export async function POST(request) {
//   try {
//     const data = await request.json();
//     const { col0, col1, col2, col3, col4 } = data;

//     const res = await sheets.spreadsheets.values.append({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: sheetRange,
//       valueInputOption: 'USER_ENTERED',
//       resource: { values: [[col0, col1, col2, col3, col4 || '']] },
//     });

//     return NextResponse.json({ message: 'Data added successfully', res });
//   } catch (error) {
//     console.error('Failed to add data:', error);
//     return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
//   }
// }

// /* - - - - - - - - - - - - - - - - */
// /* Handle PUT requests to update data in Google Sheets | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */
// export async function PUT(request) {
//   try {
//     const data = await request.json();
//     const { col0, col1, col2, col3, col4 } = data;

//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: searchRange,
//     });

//     const rowIndex = res.data.values.findIndex(row => row[0] === col0);
//     if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

//     const values = [col0, col1, col2, col3, col4 || ''];
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: `${process.env.GS_SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: { values: [values] },
//     });

//     return NextResponse.json({ message: 'Data updated successfully' });
//   } catch (error) {
//     console.error('Failed to update data:', error);
//     return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
//   }
// }

// /* - - - - - - - - - - - - - - - - */
// /* Handle DELETE requests to remove data from Google Sheets | Sree | 04 Aug 2024 */
// /* - - - - - - - - - - - - - - - - */
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const col0 = searchParams.get('col0');

//     if (!col0) {
//       console.error('col0 parameter is missing or invalid.');
//       return NextResponse.json({ error: 'Missing col0 parameter' }, { status: 400 });
//     }

//     const sheetsResponse = await sheets.spreadsheets.get({
//       spreadsheetId: process.env.GS_SHEET_ID
//     });
//     const sheetId = sheetsResponse.data.sheets.find(sheet => sheet.properties.title === process.env.GS_SHEET_NAME).properties.sheetId;

//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       range: searchRange,
//     });

//     const rowIndex = res.data.values.findIndex(row => row[0] === col0);
//     if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

//     await sheets.spreadsheets.batchUpdate({
//       spreadsheetId: process.env.GS_SHEET_ID,
//       requestBody: {
//         requests: [
//           {
//             deleteDimension: {
//               range: {
//                 sheetId: sheetId,
//                 dimension: 'ROWS',
//                 startIndex: rowIndex, // Start from the correct index
//                 endIndex: rowIndex + 1,
//               },
//             },
//           },
//         ],
//       },
//     });

//     return NextResponse.json({ message: 'Data deleted successfully' });
//   } catch (error) {
//     console.error('Failed to delete data:', error);
//     return NextResponse.json({ error: 'Failed to delete data', details: error.message }, { status: 500 });
//   }
// }
// /* - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - */
/* route.js | API Routes for Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import sheets from './googleSheetsConfig';
import { NextResponse } from 'next/server';

const { GS_SHEET_ID, GS_SHEET_NAME } = process.env;
const sheetRange = `${GS_SHEET_NAME}!A1:E`;
const searchRange = `${GS_SHEET_NAME}!A:A`;

const handleError = (error, message) => {
  console.error(`${message}:`, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

/* - - - - - - - - - - - - - - - - */
/* Handle GET requests to fetch data from Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */
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

/* - - - - - - - - - - - - - - - - */
/* Handle POST requests to add data to Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */
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

/* - - - - - - - - - - - - - - - - */
/* Handle PUT requests to update data in Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */
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

/* - - - - - - - - - - - - - - - - */
/* Handle DELETE requests to remove data from Google Sheets | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */
export async function DELETE(request) {
  try {
    const col0 = new URL(request.url).searchParams.get('col0');
    if (!col0) return NextResponse.json({ error: 'Missing col0 parameter' }, { status: 400 });

    const [sheetsResponse, valuesResponse] = await Promise.all([
      sheets.spreadsheets.get({ spreadsheetId: GS_SHEET_ID }),
      sheets.spreadsheets.values.get({ spreadsheetId: GS_SHEET_ID, range: searchRange }),
    ]);

    const sheetId = sheetsResponse.data.sheets.find(sheet => sheet.properties.title === GS_SHEET_NAME).properties.sheetId;
    const rowIndex = valuesResponse.data.values.findIndex(row => row[0] === col0);
    
    if (rowIndex === -1) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GS_SHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        }],
      },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    return handleError(error, 'Failed to delete data');
  }
}
/* - - - - - - - - - - - - - - - - */