import { useState } from 'react';
import Context from './context';
import { DataApiType } from '../Types/types';

type UserProviderProps = {
  children: React.ReactNode;
};

const INITIAL_STATE = {
  meals: [],
  drinks: [],
};

function ContextProvider({ children }: UserProviderProps) {
  const [dataApi, setDataApi] = useState<DataApiType>(INITIAL_STATE as DataApiType);

  return (
    <Context.Provider value={ { dataApi, setDataApi } }>
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
