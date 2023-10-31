import { createContext } from 'react';
import { DataApiType } from '../Types/types';

type ContextType = {
  dataApi: DataApiType;
  setDataApi: (state: DataApiType) => void;
};

const Context = createContext({} as ContextType);

export default Context;
