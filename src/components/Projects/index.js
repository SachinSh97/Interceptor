import { useState, lazy, useEffect, Suspense } from 'react';

import { projectMenuOptions } from '../../config';
import { insertRepository, insertRequest, fetchProjectList, deleteProjects } from '../../database';

import projectIcon from '../../assets/Icons/project-icon.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Repository = lazy(() => import('../Repository'));
const FormDialog = lazy(() => import('../FormDialog'));
const Requests = lazy(() => import('../Requests'));

const Projects = ({ parentId, reloadProjects }) => {
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [parentProjectId, setParentProjectId] = useState('');
  const [formDialogType, setFormDialogType] = useState('');

  useEffect(() => {
    if (!parentId) return;
    handleFetchProjects();
  }, [parentId, reloadProjects]);

  const handleFetchProjects = () =>
    fetchProjectList(parentId)
      .then((draftProjects) => setProjects(draftProjects))
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));

  const handleCloseFormDialog = () => {
    setRefresh(!refresh);
    setFormDialogType('');
    setParentProjectId('');
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: parentProjectId, name, description };
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
      .then(() => handleFetchProjects())
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value ?? '') {
      case projectMenuOptions.newFolder.id:
      case projectMenuOptions.newRequest.id:
        setParentProjectId(detail?.id);
        setFormDialogType(event?.value);
        break;
      case projectMenuOptions.delete.id:
        handleDeleteProject(detail?.id);
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
          expandIcon={projectIcon}
          rightContent={renderMenu(Object.values(projectMenuOptions), project)}
        >
          <Repository parentId={project?.id} reloadRepository={refresh} />
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

export default Projects;
