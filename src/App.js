import { lazy, Suspense, useEffect } from 'react';

import IndexedDBLibrary from './database';
import Loading from './components/elements/Loader';

import './App.scss';

const TabSidebar = lazy(() => import('./components/TabSidebar'));
const Content = lazy(() => import('./components/Content'));

const App = () => {
  useEffect(() => {
    new IndexedDBLibrary();
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <div className="app">
        <TabSidebar />
        <Content />
      </div>
    </Suspense>
  );
};

export default App;
