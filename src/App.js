import { lazy, Suspense, useEffect, useState } from 'react';

import IndexedDBLibrary from './database';
import Loader from './components/elements/Loader';

import './App.scss';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Content = lazy(() => import('./components/Content'));

const App = () => {
  const [collectionType, setCollectionType] = useState('');
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    new IndexedDBLibrary();
  }, []);

  return (
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
  );
};

export default App;
