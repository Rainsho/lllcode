import { db } from '../utils/db.js';
import { getUserSubmissions } from './bridge.js';
import { toUnix } from '../utils/date.js';

const PASS_STATUS = 'A_10';

export async function calculateCheckout(name: string, date: string): Promise<boolean> {
  if (!db.data.users[name] || !db.data.questions[date]) {
    console.log('not have enough info: user(%s), date(%s)', name, date);
    return false;
  }

  if (db.data.checkout[date]?.includes(name)) {
    console.log('user(%s) has already checked out', name);
    return true;
  }

  const { questionId } = db.data.questions[date];
  const submissions = await getUserSubmissions(name);
  const start = toUnix(date);
  const end = start + 38 * 60 * 60; // next day 2PM

  const logs = submissions.filter(
    x =>
      x.status === PASS_STATUS &&
      x.questionId === questionId &&
      x.submitTime >= start &&
      x.submitTime <= end
  );

  if (logs.length > 0) {
    console.log('user(%s) has checked', name);
    db.data.checkout[date] = db.data.checkout[date] || [];
    db.data.checkout[date].push(name);
    await db.write();

    return true;
  }

  console.log('user(%s) has not checked', name);
  return false;
}
