import { lazy, Suspense, useState } from 'react';

import Loading from './components/elements/Loader';

import './App.scss';

const TabSidebar = lazy(() => import('./components/TabSidebar'));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="app">
        <TabSidebar />
      </div>
    </Suspense>
  );
};

export default App;
