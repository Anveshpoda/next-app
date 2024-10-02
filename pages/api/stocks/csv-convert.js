// pages/api/convert.js

import fs from 'fs';
import { parse } from 'csv-parse';

export default function handler(req, res) {
    const csvFilePath = 'data/BO_Details_Cdsl.csv'; // Update the path as needed

    const rows = [];

    fs.createReadStream(csvFilePath)
        .pipe(parse({
            columns: true,
            delimiter: ',',
            skip_empty_lines: true,
            from_line: 9 // Start reading from the 8th line
        }))
        .on('data', (row) => {
            // rows.push(row);
            const cleanedRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key.trim(), value.trim()])
            );
            rows.push(cleanedRow);
        })
        .on('end', () => {
            res.status(200).json(rows);
        })
        .on('error', (error) => {
            console.error(error);
            res.status(500).json({ error: 'Error reading CSV file' });
        });
}
