import React from 'https://cdn.skypack.dev/react';
import { ColumnsType } from 'antd/es/table';
import { Button, Card, Table } from '../antd.js';
import { request } from '../utils.js';
import UserTags from './UserTags.js';

type ListDTO = {
  date: string;
  question: DailyQuestion;
  users: User[];
};

const CheckoutList: React.FC = () => {
  const [list, setList] = React.useState<ListDTO[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const update = React.useCallback(() => {
    setLoading(true);
    request
      .get('./checkout')
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    update();
  }, [update]);

  const columns = React.useMemo<ColumnsType<ListDTO>>(
    () => [
      { title: '日期', dataIndex: 'date' },
      {
        title: '题目',
        dataIndex: ['question', 'titleCn'],
        render: (title, record) => (
          <a
            href={`https://leetcode-cn.com/problems/${record.question.titleSlug}/`}
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
        render: (_, record) => <UserTags users={record.users} />,
      },
    ],
    []
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
