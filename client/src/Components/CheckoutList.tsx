import React from 'https://cdn.skypack.dev/react';
import { ColumnsType } from 'antd/es/table';
import { Button, Card, Table } from '../antd.js';
import { request } from '../utils.js';
import UserTags from './UserTags.js';
import { AppCtx } from './AppContext.js';

export type ListDTO = {
  date: string;
  question: DailyQuestion;
  users: string[];
};

const CheckoutList: React.FC = () => {
  const { list, setList, users } = React.useContext(AppCtx);
  const [loading, setLoading] = React.useState<boolean>(false);

  const userRecord = React.useMemo<Record<string, User>>(() => {
    return users.reduce((acc, cur) => Object.assign(acc, { [cur.leetcodeName]: cur }), {});
  }, [users]);

  const update = React.useCallback(() => {
    setLoading(true);
    request
      .get('./checkout')
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    update();

    // let the sw fly a moment
    const timer = setTimeout(update, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [update]);

  const columns = React.useMemo<ColumnsType<ListDTO>>(
    () => [
      { title: '日期', dataIndex: 'date' },
      {
        title: '题目',
        dataIndex: ['question', 'titleCn'],
        render: (title, record) => (
          <a
            href={`https://leetcode.cn/problems/${record.question.titleSlug}/`}
            target="_blank"
            rel="noopener"
          >
            {title}
          </a>
        ),
      },
      { title: '难度', dataIndex: ['question', 'difficulty'] },
      {
        title: '已打卡用户',
        dataIndex: 'users',
        render: (_, record) => <UserTags users={record.users.map(u => userRecord[u])} />,
      },
    ],
    [userRecord]
  );

  return (
    <Card
      title="打卡记录"
      extra={
        <Button type="primary" onClick={update}>
          刷新
        </Button>
      }
    >
      <Table<ListDTO>
        rowKey="date"
        columns={columns}
        dataSource={list}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
};

export default CheckoutList;
