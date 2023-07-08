import { useState, lazy, useEffect, Suspense } from 'react';

import { requestMenuOptions } from '../../config';
import { deleteRequests, fetchRequestList, insertRequest } from '../../database';

import threeDotIcon from '../../assets/Icons/three-dots.svg';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const RequestItem = lazy(() => import('../elements/RequestItem'));

const Requests = ({ parentId, reloadRequest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!parentId) return;
    handleFetchRequests();
  }, [parentId, reloadRequest]);

  const handleFetchRequests = () => {
    fetchRequestList(parentId)
      ?.then((draftRequest) => setRequests(draftRequest))
      ?.catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteRequest = (requestId) => {
    setIsLoading(true);
    deleteRequests('id', requestId)
      .then(() => handleFetchRequests())
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));
  };

  const handleMenuOnClick = (event, requestDetail) => {
    switch (event?.value) {
      case requestMenuOptions.rename.id:
        // handleEditRequest(re);
        break;
      case requestMenuOptions.copy.id:
        // handleEditRequest(re);
        break;
      case requestMenuOptions.delete.id:
        handleDeleteRequest(requestDetail?.id);
        break;
      default:
        break;
    }
  };

  const renderMenu = (menuItems, id) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[0, 2, 5]}
      onClick={(event) => handleMenuOnClick(event, id)}
    />
  );

  return (
    <Suspense fallback={<Loader />}>
      {isLoading && <Loader />}
      {requests?.map((requestDetail) => (
        <RequestItem
          key={requestDetail?.id}
          requestDetail={requestDetail}
          rightContent={renderMenu(Object.values(requestMenuOptions), requestDetail)}
        />
      ))}
    </Suspense>
  );
};
export default Requests;
