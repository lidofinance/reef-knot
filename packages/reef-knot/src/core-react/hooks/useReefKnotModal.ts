import { useContext } from 'react';
import { ReefKnotModalContext } from '../context/reefKnotModalContext';

export const useReefKnotModal = () => {
  const value = useContext(ReefKnotModalContext);
  if (!value)
    throw new Error(
      'useReefKnotModal was called outside of the ReefKnotModalContext',
    );
  return value;
};
