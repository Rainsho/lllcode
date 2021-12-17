import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  ADMIN_TOKEN: process.env.ADMIN_TOKEN,
  DB_FILE: resolve(__dirname, '../db.json'),
  CLIENT_FOLDER: resolve(__dirname, '../client'),
};

(async function init() {
  console.log('admin token:', CONFIG.ADMIN_TOKEN);
})();

export default CONFIG;
