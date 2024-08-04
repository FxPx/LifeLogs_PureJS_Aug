/* - - - - - - - - - - - - - - - - */
/* Google Sheets Config | Sree | 04 Aug 2024 */
/* - - - - - - - - - - - - - - - - */

import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GS_CLIENT_EMAIL,
    private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export default sheets;

/* - - - - - - - - - - - - - - - - */