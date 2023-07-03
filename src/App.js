import { lazy, Suspense, useEffect, useState } from 'react';

import { DATABASE_NAME, DATABASE_VERSION, successCode } from './config';
import { database } from './database';

import Loader from './components/elements/Loader';

import './App.scss';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Content = lazy(() => import('./components/Content'));

const App = () => {
  const [initializeDB, setInitializeDB] = useState(false);
  const [collectionType, setCollectionType] = useState('');
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    database
      .openDBConnect(DATABASE_NAME, DATABASE_VERSION)
      .then((response) => {
        if (response?.code === successCode.indexedDBInitiatedSuccessfully) {
          setInitializeDB(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    initializeDB && (
      <div className="app">
        <Suspense fallback={<Loader />}>
          <Sidebar
            requestId={requestId}
            collection={collectionType}
            setRequestId={setRequestId}
            setCollectionType={setCollectionType}
          />
          <Content
            requestId={requestId}
            collection={collectionType}
            setRequestId={setRequestId}
            setCollectionType={setCollectionType}
          />
        </Suspense>
      </div>
    )
  );
};

export default App;
