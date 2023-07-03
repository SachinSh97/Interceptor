import { lazy, Suspense, useEffect, useState } from 'react';

import { DATABASE_NAME, DATABASE_VERSION, successCode } from './config';
import { database, fetchCollections, fetchCollectionRequestsAndFolders } from './database';

import Loader from './components/elements/Loader';

import './App.scss';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Content = lazy(() => import('./components/Content'));

const App = () => {
  const [initializeDB, setInitializeDB] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [collectionType, setCollectionType] = useState('');
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    try {
      const dbInitializationResponse = await database.openDBConnect(DATABASE_NAME, DATABASE_VERSION);
      if (dbInitializationResponse?.code === successCode.indexedDBInitiatedSuccessfully) {
        const collections = await fetchCollections();

        const collectionPromises = collections?.map(async (collection) => {
          const requestsAndFolders = await fetchCollectionRequestsAndFolders(collection?.id);
          return { ...collection, children: [...requestsAndFolders] };
        });

        Promise.all(collectionPromises).then((draftCollectionData) => {
          setCollectionData(draftCollectionData);
          setInitializeDB(true);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    initializeDB && (
      <div className="app">
        <Suspense fallback={<Loader />}>
          <Sidebar
            collectionData={collectionData}
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
