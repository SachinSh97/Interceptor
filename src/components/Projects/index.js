import { useState, lazy, useEffect, Suspense } from 'react';

import { repositoryMenuOptions } from '../../config';
import { fetchProjectList, fetchRequestList, insertRepository, insertRequest } from '../../database';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Repository = lazy(() => import('../Repository'));
const RequestItem = lazy(() => import('../elements/RequestItem'));
const FormDialog = lazy(() => import('../FormDialog'));

const Projects = ({ parentId }) => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formParentId, setFormParentId] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [formDialogType, setFormDialogType] = useState('');

  useEffect(() => {
    handleFetchProjectsAndRequests();
  }, []);

  const handleFetchProjectsAndRequests = () => {
    Promise.all([fetchProjectList(parentId), fetchRequestList(parentId)])
      .then(([draftProjects, draftRequests]) => {
        setProjects(draftProjects);
        setRequests(draftRequests);
      })
      .catch((errorResponse) => alert(errorResponse));
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: formParentId, name, description };
      if (formDialogType === 'NEW_FOLDER') {
        await insertRepository(payload);
      } else if (formDialogType === 'NEW_REQUEST') {
        await insertRequest(payload);
      }
      setFormDialogType('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccordionStateChange = (id) => setSelectedProject(id);

  const handleCloseFormDialog = () => setFormDialogType('');

  const handleMenuOnClick = (event, detail) => {
    switch (event?.value ?? '') {
      case 'NEW_FOLDER':
      case 'NEW_REQUEST':
        setFormParentId(detail?.id);
        setFormDialogType(event?.value);
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
      {projects?.map((project) => (
        <Accordion
          key={project?.id}
          title={project?.name}
          description={project?.description ?? ''}
          expandIcon={selectedProject === project?.id ? openFolderIcon : closeFolderIcon}
          rightContent={renderMenu(Object.values(repositoryMenuOptions), project)}
          onOpen={() => handleAccordionStateChange(project?.id)}
          onClose={() => handleAccordionStateChange('')}
        >
          <Repository parentId={project?.id} />
        </Accordion>
      ))}
      {requests?.map((request) => (
        <RequestItem {...request} />
      ))}
      {!!formDialogType && (
        <FormDialog type={formDialogType} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
      )}
    </Suspense>
  );
};

export default Projects;
