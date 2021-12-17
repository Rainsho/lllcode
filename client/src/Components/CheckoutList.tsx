import React from 'https://cdn.skypack.dev/react';
import { ColumnsType } from 'antd/es/table';
import { Card, Table } from '../antd.js';
import { request } from '../utils.js';
import UserTags from './UserTags.js';

type ListDTO = {
  date: string;
  question: DailyQuestion;
  users: User[];
};

const CheckoutList: React.FC = () => {
  const [list, setList] = React.useState<ListDTO[]>([]);

  const update = React.useCallback(() => {
    request.get('./checkout').then(setList);
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
        render: (_, record) => {
          if (record.question.difficulty === 'Hard') {
            return '暂不统计困难打卡';
          }

          return <UserTags users={record.users} />;
        },
      },
    ],
    []
  );

  return (
    <Card title="打卡记录">
      <Table<ListDTO> rowKey="date" columns={columns} dataSource={list} pagination={false} />
    </Card>
  );
};

export default CheckoutList;
