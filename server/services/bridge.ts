import superagent from 'superagent';

const URL = 'https://leetcode.cn/graphql/';
const URL_v2 = 'https://leetcode.cn/graphql/noj-go/';

async function fetch(url: string, query: string, variables: any = {}, ext: any = {}) {
  return superagent
    .post(url)
    .send({ query, variables, ...ext })
    .then(res => res.body.data);
}

export async function getDailyQuestion(): Promise<DailyQuestion> {
  const raw = await fetch(
    URL,
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
  const { recentSubmissions: raw = [] } = await fetch(
    URL_v2,
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
