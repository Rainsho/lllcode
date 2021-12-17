import React from 'https://cdn.skypack.dev/react';
import { Tag } from '../antd.js';

const COLORS = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const UserTags: React.FC<{ users: User[] }> = ({ users }) => {
  if (users.length === 0) return <span>这里似乎还没有人~</span>;

  return (
    <>
      {users.map((user, i) => (
        <Tag key={user.leetcodeName} color={COLORS[i % COLORS.length]}>
          {user.displayName}
        </Tag>
      ))}
    </>
  );
};

export default UserTags;
