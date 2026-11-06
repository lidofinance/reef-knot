import { useContext } from 'react';
import { ReefKnotContext } from '../context/reefKnotContext';
import { ReefKnotContextValue } from '../../types';

export const useReefKnotContext = (): ReefKnotContextValue =>
  useContext(ReefKnotContext);
