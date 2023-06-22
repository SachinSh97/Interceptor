const TabPanel = ({ index, value, children }) => {
  return index === value ? children : null;
};

export default TabPanel;
