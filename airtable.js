import dotenv from './node_modules/dotenv/lib/main.js';
dotenv.config()
import Airtable from 'airtable';

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY })
const base = Airtable.base(process.env.AIRTABLE_BASE);

let stuffData = [];

base('Table 1').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function (record) {
        stuffData.push({
            dtstart: `${record.get('Start Date')}`,
            dtend: `${record.get('End Date')}`,
            description: `${record.get('Event Summary')}`,
            location: `${record.get('Event Link')}`,
            image: `${record.get('Image')}`,
            summary: `${record.get('Title')}`
        })

        console.log(stuffData)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});