import React from 'https://cdn.skypack.dev/react';
import { Button, Row, Tag } from '../antd.js';
import { request } from '../utils.js';

const DEFAULT_COLOR = '#6768AB'; // 17-3938 Very Peri

const ColorEditor: React.FC<{ user: User }> = ({ user }) => {
  const ref = React.useRef<string>(user.color);
  const [color, setColor] = React.useState<string>(user.color || DEFAULT_COLOR);
  const [loading, setLoading] = React.useState<boolean>(false);

  const applyColor = React.useCallback((leetcodeName: string, color: string) => {
    setLoading(true);
    request
      .put('./users', { leetcodeName, color })
      .then(user => {
        ref.current = user.color;
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Row align="middle">
      <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      <Tag color={color} style={{ marginInline: 12 }}>
        {user.displayName}
      </Tag>
      <Button
        size="small"
        disabled={ref.current === color}
        loading={loading}
        onClick={() => applyColor(user.leetcodeName, color)}
      >
        应用
      </Button>
    </Row>
  );
};

export default ColorEditor;
