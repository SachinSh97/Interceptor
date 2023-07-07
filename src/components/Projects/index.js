import { useState, lazy, useEffect, Suspense } from 'react';

import { projectMenuOptions, requestMenuOptions } from '../../config';
import {
  deleteProjects,
  deleteRequests,
  fetchProjectList,
  fetchRequestList,
  insertRepository,
  insertRequest,
} from '../../database';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Repository = lazy(() => import('../Repository'));
const RequestItem = lazy(() => import('../elements/RequestItem'));
const FormDialog = lazy(() => import('../FormDialog'));

const Projects = ({ parentId, refreshCollectionCount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formParentId, setFormParentId] = useState('');
  const [formDialogType, setFormDialogType] = useState('');

  useEffect(() => {
    handleFetchProjectsAndRequests();
  }, [parentId, refreshCollectionCount]);

  const handleFetchProjectsAndRequests = () =>
    Promise.all([fetchProjectList(parentId), fetchRequestList(parentId)])
      .then(([draftProjects, draftRequests]) => {
        setProjects(draftProjects);
        setRequests(draftRequests);
      })
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));

  const handleCloseFormDialog = () => {
    setFormParentId('');
    setFormDialogType('');
    handleFetchProjectsAndRequests();
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: formParentId, name, description };
      const insertHandler = formDialogType === 'NEW_FOLDER' ? insertRepository : insertRequest;
      await insertHandler(payload);
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = (id) => {
    setIsLoading(true);
    deleteProjects('id', id)
      .then(() => handleFetchProjectsAndRequests())
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteRequest = (id) => {
    setIsLoading(true);
    deleteRequests('id', id)
      .then(() => handleFetchProjectsAndRequests())
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value ?? '') {
      case projectMenuOptions.newFolder.id:
      case projectMenuOptions.newRequest.id:
        setFormParentId(detail?.id);
        setFormDialogType(event?.value);
        break;
      case projectMenuOptions.delete.id:
        handleDeleteProject(detail?.id);
        break;
      case requestMenuOptions.delete.id:
        handleDeleteRequest(detail?.id);
        break;
      default:
        break;
    }
  };

  const renderMenu = (menuItems, detail) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[0, 2, 5]}
      onClick={(event) => handleMenuOnClick(event, detail)}
    />
  );

  return (
    <Suspense fallback={<Loader />}>
      {isLoading && <Loader />}
      {projects?.map((project) => (
        <Accordion
          key={project?.id}
          title={project?.name}
          description={project?.description ?? ''}
          expandIcon={openFolderIcon}
          shrinkIcon={closeFolderIcon}
          rightContent={renderMenu(Object.values(projectMenuOptions), project)}
        >
          <Repository parentId={project?.id} />
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

export default Projects;
