import { lazy } from 'react';

import modifyRequestIcon from '../../assets/Icons/modify-response.svg';
import redirectRequestIcon from '../../assets/Icons/redirect-request.svg';
import cancelRequestIcon from '../../assets/Icons/cancel-request.svg';
import delayRequestIcon from '../../assets/Icons/delay-request.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';
import './CollectionTabPanel.scss';

const Accordion = lazy(() => import('../elements/Accordion'));
const FolderStructure = lazy(() => import('../FolderStructure'));

const CollectionTabPanel = () => {
  const handleRightOnClick = (event) => {};

  const dummyData = [
    { key: 1, type: 'folder', title: 'Roadzen', expandIcon: redirectRequestIcon, rightIcon: threeDotIcon },
    {
      key: 2,
      type: 'folder',
      title: 'Bharatpe',
      expandIcon: redirectRequestIcon,
      rightIcon: threeDotIcon,
      children: [
        {
          key: 1,
          type: 'folder',
          title: 'Bharatpe',
          children: [
            { key: 1, type: 'file', title: 'Bharatpe', method: 'POST' },
            { key: 2, type: 'file', title: 'Slack', method: 'PUT' },
            { key: 3, type: 'file', title: 'Slack', method: 'GET' },
            { key: 4, type: 'file', title: 'Slack', method: 'DELETE' },
            { key: 5, type: 'file', title: 'Slack', method: 'PATCH' },
            { key: 6, type: 'file', title: 'Slack', method: 'OPTIONS' },
          ],
        },
      ],
    },
  ];

  const renderCollections = (collectionType) =>
    ({ MODIFY_RESPONSE: <FolderStructure folders={dummyData} /> }[collectionType]);

  const collectionItemProps = [
    {
      key: 'MODIFY_RESPONSE',
      title: 'Modify Response',
      description: 'Modify Response of any XHR/Fetch request',
      expandIcon: modifyRequestIcon,
      rightIcon: threeDotIcon,
    },
    {
      key: 'REDIRECT_REQUEST',
      title: 'Redirect Request',
      description: 'Redirect a matching pattern to another URL',
      expandIcon: redirectRequestIcon,
      rightIcon: threeDotIcon,
    },
    {
      key: 'CANCEL_REQUEST',
      title: 'Cancel Request',
      description: 'Block URLs by specifying keywords or entire URL',
      expandIcon: cancelRequestIcon,
      rightIcon: threeDotIcon,
    },
    {
      key: 'DELAY_REQUEST',
      title: 'Delay Request',
      description: 'Introduce a lag or delay to the response from specific URLs',
      expandIcon: delayRequestIcon,
      rightIcon: threeDotIcon,
    },
  ];

  return (
    <div className="collection-tab-panel">
      {collectionItemProps?.map((collectionItem) => (
        <Accordion {...collectionItem} rightIcon={threeDotIcon} rightOnClick={handleRightOnClick}>
          {renderCollections(collectionItem?.key)}
        </Accordion>
      ))}
    </div>
  );
};

export default CollectionTabPanel;
