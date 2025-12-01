import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Memory } from 'lowdb';

const defaultData = {
    users: [],
    vendors: [],
    bookings: [],
    reviews: [],
    messages: [],
    enquiries: [],
    wishlist: [],
    budget: [],
    notifications: []
};

// Check if running in Netlify Functions (or generic cloud env)
// Netlify defines NETLIFY=true. AWS_LAMBDA_FUNCTION_VERSION is also present.
const isCloud = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_VERSION;

let db;

if (isCloud) {
    console.log('☁️ Running in Cloud Mode (Memory DB)');
    db = new Low(new Memory(), defaultData);
} else {
    console.log('💻 Running in Local Mode (File DB)');
    db = new Low(new JSONFile('db.json'), defaultData);
}

// Initialize
await db.read();
db.data ||= defaultData;

// Ensure all keys exist
for (const key in defaultData) {
    if (!db.data[key]) db.data[key] = defaultData[key];
}

await db.write();

export default db;
