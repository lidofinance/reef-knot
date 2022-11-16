import { useState, useCallback } from 'react';

const useModal = () => {
  const [state, setState] = useState(false);
  const handleOpen = useCallback(() => setState(true), []);
  const handleClose = useCallback(() => {
    setState(false);
  }, []);

  return { state, handleOpen, handleClose };
};

export default useModal;
