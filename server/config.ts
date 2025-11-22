import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  ADMIN_TOKEN: process.env.ADMIN_TOKEN,
  DB_FILE: resolve(__dirname, '../db.json'),
  CLIENT_FOLDER: resolve(__dirname, '../client'),
};

(async function init() {
  if (process.env.RUN_ENV === 'docker' && existsSync('/app/data/db.json')) {
    CONFIG.DB_FILE = '/app/data/db.json';
  }

  console.log('db file:', CONFIG.DB_FILE);
  console.log('admin token:', CONFIG.ADMIN_TOKEN);
})();

export default CONFIG;
