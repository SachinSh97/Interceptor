import { useState, lazy, useEffect, Suspense } from 'react';

import { projectMenuOptions } from '../../config';
import { insertRepository, insertRequest, fetchProjectList, deleteProjects } from '../../database';

import projectIcon from '../../assets/Icons/project-icon.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Repository = lazy(() => import('../Repository'));
const Requests = lazy(() => import('../Requests'));
const FormDialog = lazy(() => import('../FormDialog'));
const ConfirmationDialog = lazy(() => import('../ConfirmationDialog'));

const Projects = ({ parentId, reloadProjects }) => {
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [parentProject, setParentProject] = useState({});
  const [formDialogType, setFormDialogType] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    if (!parentId) return;
    handleFetchProjects();
  }, [parentId, reloadProjects]);

  const handleFetchProjects = () =>
    fetchProjectList(parentId)
      .then((draftProjects) => setProjects(draftProjects))
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
  };

  const handleCloseFormDialog = () => {
    setRefresh(!refresh);
    setFormDialogType('');
    setParentProject({});
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: parentProject?.id, name, description };
      const insertHandler = formDialogType === 'NEW_FOLDER' ? insertRepository : insertRequest;
      await insertHandler(payload);
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnConfirmDeleteProject = () => {
    setIsLoading(true);
    deleteProjects('id', parentProject?.id)
      .then(() => {
        handleCloseConfirmationDialog();
        handleFetchProjects();
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value ?? '') {
      case projectMenuOptions.newFolder.id:
      case projectMenuOptions.newRequest.id:
        setParentProject(detail);
        setFormDialogType(event?.value);
        break;
      case projectMenuOptions.delete.id:
        setParentProject(detail);
        setShowConfirmationDialog(true);
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
        {showConfirmationDialog && (
          <ConfirmationDialog
            open={showConfirmationDialog}
            content={`Are you sure you want to delete '${parentProject?.name}' project ?`}
            onClose={handleCloseConfirmationDialog}
            onConfirm={handleOnConfirmDeleteProject}
          />
        )}
      </Suspense>
    </Suspense>
  );
};

export default Projects;
