import { useEffect } from 'react';

import { blur } from './blur';

interface UseBlurProps {
  isBlur: boolean;
  callback?: (isBlur: boolean) => void;
}

export const useBlur = ({ isBlur, callback }: UseBlurProps) => {
  useEffect(() => {
    if (isBlur) {
      blur.add();
      const nextElement = document.getElementById('__next');
      if (nextElement) {
        nextElement.style.overflow = 'hidden';
      }
    } else {
      blur.remove();
      const nextElement = document.getElementById('__next');
      if (nextElement) {
        nextElement.style.overflow = '';
      }
    }
    callback?.(isBlur);
    return () => {
      blur.remove();
      const nextElement = document.getElementById('__next');
      if (nextElement) {
        nextElement.style.overflow = '';
      }
    };
  }, [isBlur, callback]);

  return isBlur;
};
