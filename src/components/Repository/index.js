import { Fragment, lazy, useState } from 'react';

import { repositoryMenuOptions, requestMenuOptions } from '../../config';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

import './Repository.scss';

const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const RequestItem = lazy(() => import('../elements/RequestItem'));

const Repository = ({ repositories }) => {
  const [selectedFile, setSelectedFile] = useState('');
  const [openedFolder, setOpenedFolder] = useState('');

  const handleSetOpenedFolder = (folder) => setOpenedFolder(folder);

  const handleMenuOnClick = (event) => {
    const { value, syntheticEvent } = event;
  };

  const renderMenu = (menuItems) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[0, 2, 5]}
      onClick={handleMenuOnClick}
    />
  );

  return repositories?.map((repository, index) => (
    <Fragment key={repository?.id ?? index}>
      {
        {
          repository: (
            <Accordion
              title={repository?.title}
              description={repository?.description ?? ''}
              expandIcon={openedFolder === repository?.id ? openFolderIcon : closeFolderIcon}
              rightContent={renderMenu(repositoryMenuOptions)}
              onOpen={() => handleSetOpenedFolder(repository?.id)}
              onClose={() => handleSetOpenedFolder('')}
            >
              <Repository repositories={repository?.children} />
            </Accordion>
          ),
          request: (
            <RequestItem
              title={repository?.title}
              method={repository?.method}
              active={selectedFile === repository?.title}
              rightContent={renderMenu(requestMenuOptions)}
              onClick={() => setSelectedFile(repository?.title)}
            />
          ),
        }[repository?.type]
      }
    </Fragment>
  ));
};

export default Repository;
