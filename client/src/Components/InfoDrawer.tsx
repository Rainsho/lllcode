import React from 'https://cdn.skypack.dev/react';
import { Button, Drawer, Input, Space, message } from '../antd.js';
import { request } from '../utils.js';

const { useState } = React;

const InfoDrawer: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [token, setToken] = useState(() => {
    const tc = document.cookie
      .split(';')
      .map(x => x.trim())
      .map(x => x.split('='))
      .filter(x => x[0] === 'token')
      .map(x => x[1]);

    return tc[0] || '';
  });
  const [cookie, setCookie] = useState(() => document.cookie);

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        shape="circle"
        style={{ position: 'fixed', right: 50, bottom: 50, width: 50, height: 50 }}
      >
        TOKEN
      </Button>
      <Drawer placement="right" onClose={() => setVisible(false)} visible={visible}>
        <Space direction="vertical" size="middle">
          <div>
            <span>token:</span>
            <Input value={token} onChange={e => setToken(e.target.value)} />
          </div>
          <Button type="primary" onClick={() => (document.cookie = `token=${token}`)}>
            更新
          </Button>
        </Space>
        <Space direction="vertical" size="middle">
          <div>
            <span>cookie:</span>
            <Input value={cookie} onChange={e => setCookie(e.target.value)} />
          </div>
          <Button
            type="primary"
            onClick={() => {
              request.post('/cookie', { cookie }).then(() => {
                message.success('ok');
              });
            }}
          >
            更新
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default InfoDrawer;
