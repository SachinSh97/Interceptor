import { lazy, useState } from 'react';

import { database, insertProject } from '../../database';
import { objectStores, collectionMenuOptions } from '../../config';
import { getCollectionIcon } from '../../selectors';

import threeDotIcon from '../../assets/Icons/three-dots.svg';
import './Collection.scss';

const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Projects = lazy(() => import('../Projects'));
const FormDialog = lazy(() => import('../FormDialog'));

const Collection = ({ requestId, setRequestId, collectionData, setCollectionType }) => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [parentId, setParentId] = useState('');
  const [menuOption, setMenuOption] = useState('');

  const handleOnTriggerOpening = (selectedCollectionType) => {
    setCollectionType(selectedCollectionType);
  };

  const handleMenuOnClick = (event, id) => {
    const { value } = event;
    switch (value) {
      case collectionMenuOptions?.newProject?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      case collectionMenuOptions?.newRequest?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      case collectionMenuOptions?.delete?.id:
        handleDelete(id);
        break;
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    try {
      await database?.deleteByIndex(objectStores.project, 'parentId', id);
      await database?.deleteByIndex(objectStores.request, 'parentId', id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId, name, description };
      if (menuOption === collectionMenuOptions?.newProject?.id) {
        const response = await insertProject(payload);
      } else if (menuOption === collectionMenuOptions?.newRequest?.id) {
        await database?.addOne(objectStores.request, payload);
      }
      setParentId('');
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
      dividerIndices={[1, 3, 5]}
      onClick={(event) => handleMenuOnClick(event, id)}
    />
  );

  return (
    <div className="collection">
      {collectionData?.map((collection, index) => (
        <Accordion
          key={collection?.id ?? index}
          title={collection?.title ?? ''}
          description={collection?.description ?? ''}
          type={collection?.type ?? ''}
          expandIcon={getCollectionIcon(collection?.type ?? '')}
          rightContent={renderMenu(Object.values(collectionMenuOptions), collection?.id)}
          onTriggerOpening={() => handleOnTriggerOpening(collection?.type ?? '')}
        >
          <Projects parentId={collection?.id ?? ''} />
        </Accordion>
      ))}
      {showFormDialog && (
        <FormDialog open={showFormDialog} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
      )}
    </div>
  );
};

export default Collection;
