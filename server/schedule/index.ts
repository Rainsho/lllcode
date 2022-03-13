import moment from 'moment';
import schedule from 'node-schedule';
import { calculateCheckout } from '../services/checkout.js';
import { db } from '../utils/db.js';
import { getToday } from '../services/api.js';

const log = (...args) => console.log(new Date(), ...args);

schedule.scheduleJob('0 2,4 * * *', async () => {
  await getToday();
  log('update today question done');
});

schedule.scheduleJob('0 3-23/2 * * *', async () => {
  const today = moment().format('YYYY-MM-DD');
  const users = Object.values(db.data.users);

  for (const user of users) {
    await calculateCheckout(user.leetcodeName, today);
  }
  log(`check today[${today}] question done`);
});

schedule.scheduleJob('50 1-13/2 * * *', async () => {
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
  const users = Object.values(db.data.users);

  for (const user of users) {
    await calculateCheckout(user.leetcodeName, yesterday);
  }
  log(`check yesterday[${yesterday}] question done`);
});
