import { Fragment, lazy, useEffect, useState, Suspense } from 'react';

import { insertRequest, fetchRespositoryList, fetchRequestList, deleteRequests } from '../../database';
import { repositoryMenuOptions, requestMenuOptions } from '../../config';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

import './Repository.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const RequestItem = lazy(() => import('../elements/RequestItem'));
const FormDialog = lazy(() => import('../FormDialog'));

const Repository = ({ parentId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formParentId, setFormParentId] = useState('');
  const [formDialogType, setFormDialogType] = useState('');

  useEffect(() => {
    handleFetchRepositoryAndRequests();
  }, [parentId]);

  const handleFetchRepositoryAndRequests = () => {
    Promise.all([fetchRespositoryList(parentId), fetchRequestList(parentId)])
      .then(([draftRepositories, draftRequests]) => {
        setRepositories(draftRepositories);
        setRequests(draftRequests);
      })
      .catch((errorResponse) => {})
      .finally(() => setIsLoading(false));
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: formParentId, name, description };
      await insertRequest(payload);
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRequest = (id) => {
    setIsLoading(true);
    deleteRequests('id', id)
      .then(() => handleFetchRepositoryAndRequests())
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleCloseFormDialog = () => {
    setFormParentId('');
    setFormDialogType('');
    handleFetchRepositoryAndRequests();
  };

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value) {
      case repositoryMenuOptions.newRequest.id:
        setFormParentId(detail?.id);
        setFormDialogType(event?.value);
        break;
      case repositoryMenuOptions.delete.id:
        handleDeleteRequest(detail?.id);
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
      {repositories?.map((repository) => (
        <Accordion
          key={repository?.id}
          title={repository?.name}
          description={repository?.description ?? ''}
          expandIcon={openFolderIcon}
          shrinkIcon={closeFolderIcon}
          rightContent={renderMenu(Object.values(repositoryMenuOptions), repository)}
        >
          <Repository parentId={repository?.id} />
        </Accordion>
      ))}
      {requests?.map((request) => (
        <RequestItem
          key={request?.id}
          {...request}
          rightContent={renderMenu(Object.values(requestMenuOptions), request)}
        />
      ))}
      {!!formDialogType && (
        <FormDialog type={formDialogType} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
      )}
    </Suspense>
  );
};

export default Repository;
