import { db } from '../utils/db.js';

async function request(query: string, variables: any = {}, ext: any = {}) {
  return fetch('https://leetcode.cn/graphql/', {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      authorization: '',
      'content-type': 'application/json',
      priority: 'u=1, i',
      'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://leetcode.cn/problemset/',
      cookie: db.data.cookie,
    },
    body: JSON.stringify({ query, variables, ...ext }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(json => json.data);
}

export async function getDailyQuestion(): Promise<DailyQuestion> {
  const raw = await request(
    `
    query questionOfTodayV2 {
      todayRecord {
        date
        question {
          questionId: questionFrontendId
          difficulty
          title
          titleCn: translatedTitle
          titleSlug
        }
      }
    }
    `
  );

  const { date, question } = raw.todayRecord[0];

  return Object.assign({}, { date }, question);
}

type Submission = {
  status: string;
  lang: string;
  questionId: string;
  submitTime: number;
};

export async function getUserSubmissions(userSlug: string): Promise<Submission[]> {
  const { recentSubmissions: raw = [] } = await request(
    `
  query recentSubmissions($userSlug: String!) {
    recentSubmissions(userSlug: $userSlug) {
      status
      lang
      question {
        questionId: questionFrontendId
      }
      submitTime
    }
  }`,
    { userSlug }
  );

  return raw.map(({ question, ...ext }) => Object.assign({}, ext, question));
}
