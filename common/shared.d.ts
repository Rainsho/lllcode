declare type User = {
  leetcodeName: string; // as id
  displayName: string;
  color?: string;
};

declare type DailyQuestion = {
  date: string; // as id
  questionId: string;
  difficulty: string;
  title: string;
  titleCn: string;
  titleSlug: string;
};

declare type Names = string[]; // date as id
