import { useContext } from 'react';
import { ReefKnotContext, ReefKnotContextValue } from '../context/reefKnot';

export const useReefKnotContext = (): ReefKnotContextValue =>
  useContext(ReefKnotContext);
