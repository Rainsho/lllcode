import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { PageHeader } from './antd.js';
import AppContext from './Components/AppContext.js';
import CheckoutList from './Components/CheckoutList.js';
import InfoDrawer from './Components/InfoDrawer.js';
import UserList from './Components/UserList.js';

const App: React.FC = () => {
  return (
    <AppContext>
      <PageHeader>
        <UserList />
        <CheckoutList />
        <InfoDrawer />
      </PageHeader>
    </AppContext>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
