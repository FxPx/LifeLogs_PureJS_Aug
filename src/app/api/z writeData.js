/* src/app/api/writeData.js */

import { appendSheetData } from './fxFetchData';

export default async function handler(req, res) {
    console.log('Reached /api/writeData'); // Log to confirm the route is being hit

    if (req.method === 'POST') {
        try {
            console.log('Received POST request:', req.body); // Log the request body
            const { values } = req.body;
            const result = await appendSheetData(values);
            res.status(200).json({ message: 'Data appended successfully', result });
        } catch (error) {
            console.error('Error in appendSheetData:', error); // Log any errors during appending
            res.status(500).json({ message: 'Failed to append data', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
