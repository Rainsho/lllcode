import superagent from 'superagent';

const URL = 'https://leetcode.cn/graphql/';

async function fetch(query: string, variables: any = {}, ext: any = {}) {
  return superagent
    .post(URL)
    .send({ query, variables, ...ext })
    .then(res => res.body.data);
}

export async function getDailyQuestion(): Promise<DailyQuestion> {
  const raw = await fetch(`
    query questionOfToday {
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
    `);

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
  const { recentSubmissions: raw = [] } = await fetch(
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
