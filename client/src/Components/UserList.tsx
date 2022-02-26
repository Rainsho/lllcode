import React from 'https://cdn.skypack.dev/react';
import { ColumnsType } from 'antd/es/table';
import { Button, Card, Form, Input, Space, Table } from '../antd.js';
import { request } from '../utils.js';
import ColorEditor from './ColorEditor.js';

const UserList: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [form] = Form.useForm();

  const update = React.useCallback(() => {
    setLoading(true);
    request
      .get('./users')
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const upsertUser = React.useCallback(
    (user: User) => {
      request.post('./users', user).then(() => {
        form.resetFields();
        update();
      });
    },
    [update, form.resetFields]
  );

  React.useEffect(() => {
    update();
  }, [update]);

  const columns = React.useMemo<ColumnsType<User>>(
    () => [
      { title: '用户', dataIndex: 'displayName' },
      { title: 'LeetCode 用户名', dataIndex: 'leetcodeName' },
      { title: '颜色', dataIndex: 'color', render: (_, user) => <ColorEditor user={user} /> },
    ],
    []
  );

  return (
    <Card
      title="用户列表"
      style={{ marginTop: 32 }}
      extra={
        <Space>
          <Form layout="inline" form={form} onFinish={upsertUser}>
            <Form.Item label="用户" name="displayName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="LeetCode 用户名" name="leetcodeName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                添加用户
              </Button>
            </Form.Item>
          </Form>
        </Space>
      }
    >
      <Table<User>
        rowKey="leetcodeName"
        columns={columns}
        dataSource={users}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
};

export default UserList;
