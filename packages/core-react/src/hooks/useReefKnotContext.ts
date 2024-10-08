import { useContext } from 'react';
import {
  ReefKnotContext,
  ReefKnotContextValue,
} from '../context/reefKnotContext';

export const useReefKnotContext = (): ReefKnotContextValue =>
  useContext(ReefKnotContext);
