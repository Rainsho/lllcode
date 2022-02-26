import Boom from '@hapi/boom';
import moment from 'moment';
import CONFIG from '../config.js';
import { db } from '../utils/db.js';
import { getDailyQuestion, getUserSubmissions } from './bridge.js';
import { calculateCheckout } from './checkout.js';

function checkToken(req) {
  const { token } = req.state;

  if (token !== CONFIG.ADMIN_TOKEN) {
    throw Boom.unauthorized('Invalid token!');
  }
}

export async function upsertUser(req) {
  checkToken(req);

  const { displayName, leetcodeName } = req.payload;

  if (!displayName || !leetcodeName) {
    throw Boom.badData('Must provide `displayName` and `leetcodeName`.');
  }

  const user = db.data.users[leetcodeName] || { displayName, leetcodeName };
  user.displayName = displayName;
  db.data.users[leetcodeName] = user;

  await db.write();

  return user;
}

export async function updateUser(req) {
  const { leetcodeName, color } = req.payload;

  if (!leetcodeName || !db.data.users[leetcodeName]) {
    throw Boom.badData('User is not exist.');
  }

  const user = db.data.users[leetcodeName];

  if (color) {
    user.color = color;
  }

  db.data.users[leetcodeName] = user;
  await db.write();

  return user;
}

export async function getToday() {
  const question = await getDailyQuestion();

  if (!db.data.questions[question.date]) {
    db.data.questions[question.date] = question;
    await db.write();
  }

  return question;
}

export async function getSubmissions(req) {
  const { name } = req.query;

  if (!name) {
    throw Boom.badData('Must provide `name`.');
  }

  return getUserSubmissions(name);
}

export async function checkUser(req) {
  checkToken(req);

  const { name, date = moment().format('YYYY-MM-DD') } = req.payload;
  const status = await calculateCheckout(name, date);

  return { name, date, status };
}

export async function getUserCheckout() {
  const questions = Object.entries(db.data.questions);

  return questions
    .map(([date, question]) => ({
      date,
      question,
      users: (db.data.checkout[date] || []).map(name => db.data.users[name]),
    }))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
