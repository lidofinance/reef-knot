import { useContext } from 'react';
import { ReefKnotContext, ReefKnotContextValue } from '../context';

export const useReefKnotContext = (): ReefKnotContextValue =>
  useContext(ReefKnotContext);
