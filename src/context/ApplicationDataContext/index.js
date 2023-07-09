import { createContext, useReducer } from 'react';

const initialApplicationData = {};

// create reducer
const applicationDataReducer = (globalData, action) => {
  switch (action?.type) {
    case 'collection': {
      return { ...globalData, collection: { ...(action?.collection ?? {}) } };
    }
    case 'request': {
      return { ...globalData, request: { ...(action?.request ?? {}) } };
    }
    default: {
      return { ...globalData };
    }
  }
};

// create the context
const ApplicationDataContext = createContext();

//Create Provider component
const ApplicationDataProvider = ({ children }) => {
  const [applicationData, setApplicationData] = useReducer(applicationDataReducer, initialApplicationData);

  return (
    <ApplicationDataContext.Provider value={{ applicationData, setApplicationData }}>
      {children}
    </ApplicationDataContext.Provider>
  );
};

export { ApplicationDataContext, ApplicationDataProvider };
