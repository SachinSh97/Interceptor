import { lazy, useEffect, useState, Suspense } from 'react';

import { insertRequest, fetchRespositoryList, deleteRequests } from '../../database';
import { repositoryMenuOptions } from '../../config';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

import './Repository.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const FormDialog = lazy(() => import('../FormDialog'));
const Requests = lazy(() => import('../Requests'));

const Repository = ({ parentId, reloadRepository }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [parentRepositoryId, setParentRepositoryId] = useState('');
  const [formDialogType, setFormDialogType] = useState('');
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (!parentId) return;
    handleFetchRepository();
  }, [parentId, reloadRepository]);

  const handleFetchRepository = () => {
    fetchRespositoryList(parentId)
      .then((draftRepositories) => setRepositories(draftRepositories))
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: parentRepositoryId, name, description };
      await insertRequest(payload);
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRequest = (id) => {
    setIsLoading(true);
    deleteRequests('id', id)
      .then(() => handleFetchRepository())
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleCloseFormDialog = () => {
    setParentRepositoryId('');
    setFormDialogType('');
    setRefresh(!refresh);
  };

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value) {
      case repositoryMenuOptions.newRequest.id:
        setParentRepositoryId(detail?.id);
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
          <Requests parentId={repository?.id} reloadRequest={refresh} />
        </Accordion>
      ))}
      <Requests parentId={parentId} reloadRequest={refresh} />
      <Suspense fallback={<Loader />}>
        {!!formDialogType && (
          <FormDialog type={formDialogType} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
        )}
      </Suspense>
    </Suspense>
  );
};

export default Repository;
