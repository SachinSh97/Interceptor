import { lazy, Suspense, useEffect, useState } from 'react';

import { successCode } from './config';
import { initializeDatabase } from './database';
import { ApplicationDataProvider } from './context';

import Loader from './components/elements/Loader';

import './App.scss';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Content = lazy(() => import('./components/Content'));

const App = () => {
  const [initializeDB, setInitializeDB] = useState(false);

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = () => {
    initializeDatabase().then((response) => {
      if (response?.code === successCode.indexedDBInitiatedSuccessfully) {
        setInitializeDB(true);
      }
    });
  };

  return (
    initializeDB && (
      <div className="app">
        <Suspense fallback={<Loader />}>
          <ApplicationDataProvider>
            <Sidebar />
            <Content />
          </ApplicationDataProvider>
        </Suspense>
      </div>
    )
  );
};

export default App;
