import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import CONFIG from '../config.js';

type DBData = {
  users: Record<string, User>;
  questions: Record<string, DailyQuestion>;
  checkout: Record<string, Names>;
};

export const db = new Low<DBData>(new JSONFile(CONFIG.DB_FILE));

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  (async function () {
    await db.read();

    if (!db.data) {
      db.data = { users: {}, questions: {}, checkout: {} };
    }

    if (!db.data.users) db.data.users = {};
    if (!db.data.questions) db.data.questions = {};
    if (!db.data.checkout) db.data.checkout = {};

    await db.write();
  })();
}
