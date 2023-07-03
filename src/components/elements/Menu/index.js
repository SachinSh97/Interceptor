import { Fragment } from 'react';
import { Menu, MenuItem, MenuDivider } from '@szhsin/react-menu';

import '@szhsin/react-menu/dist/index.css';
import './Menu.scss';

const CustomMenu = ({ menuButton, menuItems, dividerIndices, onClick }) => {
  return (
    <Menu menuClassName="app-menu" menuButton={menuButton ?? ''}>
      {menuItems?.map((menuItem, index) => (
        <Fragment key={menuItem?.id}>
          <MenuItem value={menuItem?.id} disabled={menuItem?.disabled} onClick={onClick}>
            {menuItem?.label ?? ''}
          </MenuItem>
          {dividerIndices?.includes(index) && <MenuDivider />}
        </Fragment>
      ))}
    </Menu>
  );
};

export default CustomMenu;
