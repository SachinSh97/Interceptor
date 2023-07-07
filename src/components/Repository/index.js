import { Fragment, lazy, useEffect, useState, Suspense } from 'react';

import { insertRepository, insertRequest, fetchRespositoryList, fetchRequestList } from '../../database';
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
  const [repositories, setRepositories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('');
  const [showFormDialog, setShowFormDialog] = useState(false);

  useEffect(() => {
    handleFetchRepositoryAndRequests();
  }, []);

  const handleFetchRepositoryAndRequests = () => {
    Promise.all([fetchRespositoryList(parentId), fetchRequestList(parentId)])
      .then(([draftRepositories, draftRequests]) => {
        setRepositories(draftRepositories);
        setRequests(draftRequests);
      })
      .catch((errorResponse) => {});
  };

  const handleAccordionStateChange = (id) => setSelectedRepository(id);

  const handleMenuOnClick = (event, id) => {};

  const handleFormOnSubmit = async ({ name, description }) => {};

  const handleCloseFormDialog = () => setShowFormDialog(false);

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
      {repositories?.map((repository) => (
        <Accordion
          key={repository?.id}
          title={repository?.name}
          description={repository?.description ?? ''}
          expandIcon={selectedRepository === repository?.id ? openFolderIcon : closeFolderIcon}
          rightContent={renderMenu(Object.values(repositoryMenuOptions), repository?.id)}
          onOpen={() => handleAccordionStateChange(repository?.id)}
          onClose={() => handleAccordionStateChange('')}
        >
          <Repository parentId={repository?.id} />
        </Accordion>
      ))}
      {requests?.map((request) => (
        <RequestItem key={request?.id} title={request?.name} method={request?.method} />
      ))}
      {showFormDialog && (
        <FormDialog open={showFormDialog} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
      )}
    </Suspense>
  );
};

export default Repository;
