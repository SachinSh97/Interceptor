import { lazy, useState, Suspense, Fragment, useEffect, useContext } from 'react';

import { database } from '../../database';
import { prefix, objectStores, collectionType } from '../../config';
import { ApplicationDataContext } from '../../context';

import closeIcon from '../../assets/Icons/close-icon.svg';
import './Content.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Tabs = lazy(() => import('../elements/Tabs'));
const MockRequestForm = lazy(() => import('../MockRequestForm'));

const Content = () => {
  const { applicationData, setApplicationData } = useContext(ApplicationDataContext);

  const [openedRequests, setOpenedRequests] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(-1);

  useEffect(() => {
    const handleUpdateOpenedRequestTabs = async (requestId) => {
      const requestDetails = await database?.getByIndex(objectStores.request, 'id', requestId);
      const draftOpenedRequests = [...openedRequests, requestDetails];
      const draftActiveTabIndex = draftOpenedRequests?.findIndex((openRequest) => openRequest?.id === requestId);

      setActiveTabIndex(draftActiveTabIndex);
      setOpenedRequests(draftOpenedRequests);
    };

    if (applicationData?.request?.id) {
      if (!openedRequests?.some((openedRequest) => openedRequest?.id === applicationData?.request?.id)) {
        handleUpdateOpenedRequestTabs(applicationData?.request?.id);
      } else {
        const draftActiveTabIndex = openedRequests?.findIndex(
          (openRequest) => openRequest?.id === applicationData?.request?.id,
        );
        setActiveTabIndex(draftActiveTabIndex);
      }
    }
  }, [applicationData?.request]);

  const handleTabOnClick = (updatedTabindex) => {
    setActiveTabIndex(updatedTabindex);
    setApplicationData({ type: 'request', request: openedRequests?.[updatedTabindex] ?? {} });
  };

  const handleCloseOpenedTab = (event, id) => {
    event?.stopPropagation();
    const index = openedRequests?.findIndex((openedRequest) => openedRequest?.id === id);
    const draftOpenedRequests = openedRequests?.filter((openRequest) => openRequest?.id !== id);
    setActiveTabIndex(index - 1);
    setOpenedRequests(draftOpenedRequests);
    setApplicationData({ type: 'request', request: draftOpenedRequests?.[index] ?? {} });
  };

  const getOpenTabs = () =>
    openedRequests?.map((openedRequest, index) => (
      <Fragment key={openedRequest?.id ?? index}>
        <span className="prefix">{prefix}</span>
        <span className="name">{openedRequest?.name ?? ''}</span>
        <img
          className="close-icon"
          src={closeIcon}
          alt="X"
          onClick={(event) => handleCloseOpenedTab(event, openedRequest?.id)}
        />
      </Fragment>
    ));

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex content">
        <div className="content_left">
          <Tabs tabs={getOpenTabs()} activeTabIndex={activeTabIndex} onClick={handleTabOnClick} />
          {applicationData?.collection?.type === collectionType?.mockRequest && activeTabIndex > -1 && (
            <MockRequestForm requestId={applicationData?.request?.id} />
          )}
        </div>
        <div className="vertical-divider" />
        <div className="content_right"></div>
      </div>
    </Suspense>
  );
};

export default Content;
