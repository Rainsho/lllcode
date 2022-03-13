import React from 'https://cdn.skypack.dev/react';
import type { ListDTO } from './CheckoutList.js';

type IAppCtx = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  list: ListDTO[];
  setList: React.Dispatch<React.SetStateAction<ListDTO[]>>;
};

export const AppCtx = React.createContext<IAppCtx>(null);

const AppContext: React.FC = ({ children }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [list, setList] = React.useState<ListDTO[]>([]);

  return <AppCtx.Provider value={{ users, setUsers, list, setList }}>{children}</AppCtx.Provider>;
};

export default AppContext;
