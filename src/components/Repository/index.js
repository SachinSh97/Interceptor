import { Fragment, lazy, useState } from 'react';
import { nanoid } from 'nanoid';

import { database } from '../../database';
import { repositoryMenuOptions, requestMenuOptions, objectStores } from '../../config';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import closeFolderIcon from '../../assets/Icons/close-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

import './Repository.scss';

const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const RequestItem = lazy(() => import('../elements/RequestItem'));
const FormDialog = lazy(() => import('../FormDialog'));

const Repository = ({ repositories, requestId, setRequestId }) => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [parentId, setParentId] = useState('');
  const [openedFolder, setOpenedFolder] = useState('');
  const [menuOption, setMenuOption] = useState('');

  const handleSetOpenedFolder = (folder) => setOpenedFolder(folder);

  const handleMenuOnClick = (event, id) => {
    const { value } = event;
    switch (value) {
      case repositoryMenuOptions?.newFolder?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      case repositoryMenuOptions?.newRequest?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      default:
        break;
    }
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId, name, description };
      if (menuOption === repositoryMenuOptions?.newFolder?.id) {
        payload['type'] = 'project';
        await database?.addOne(objectStores.repository, payload);
      } else if (menuOption === repositoryMenuOptions?.newRequest?.id) {
        payload['type'] = 'request';
        payload['method'] = 'GET';
        await database?.addOne(objectStores.request, payload);
      }
      setMenuOption('');
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

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
    <>
      {repositories?.map((repository, index) => (
        <Fragment key={repository?.id ?? index}>
          {
            {
              project: (
                <Accordion
                  title={repository?.name}
                  description={repository?.description ?? ''}
                  expandIcon={openedFolder === repository?.id ? openFolderIcon : closeFolderIcon}
                  rightContent={renderMenu(Object.values(repositoryMenuOptions), repository?.id)}
                  onOpen={() => handleSetOpenedFolder(repository?.id)}
                  onClose={() => handleSetOpenedFolder('')}
                >
                  <Repository
                    repositories={repository?.children}
                    requestId={requestId}
                    setRequestId={setRequestId}
                  />
                </Accordion>
              ),
              repository: (
                <Accordion
                  title={repository?.name}
                  description={repository?.description ?? ''}
                  expandIcon={openedFolder === repository?.id ? openFolderIcon : closeFolderIcon}
                  rightContent={renderMenu(Object.values(repositoryMenuOptions), repository?.id)}
                  onOpen={() => handleSetOpenedFolder(repository?.id)}
                  onClose={() => handleSetOpenedFolder('')}
                >
                  <Repository
                    repositories={repository?.children}
                    requestId={requestId}
                    setRequestId={setRequestId}
                  />
                </Accordion>
              ),
              request: (
                <RequestItem
                  title={repository?.name}
                  method={repository?.method}
                  active={repository?.id === requestId}
                  rightContent={renderMenu(requestMenuOptions)}
                  onClick={() => setRequestId(repository?.id)}
                />
              ),
            }[repository?.type]
          }
        </Fragment>
      ))}
      {showFormDialog && (
        <FormDialog
          open={showFormDialog}
          onSubmit={handleFormOnSubmit}
          onClose={handleCloseFormDialog}
        />
      )}
    </>
  );
};

export default Repository;
