import React, { ReactNode, MouseEvent } from 'react';
import ReactDOM from 'react-dom';

import { useBlur } from '../../hooks';
import { CancelIcon, LoadingIcon } from '@/icons';

interface ModalProps {
  children: ReactNode;
  title: string;
  className?: string;
  footerButtonText?: string;
  saveLoading?: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  className = '',
  footerButtonText,
  saveLoading = false,
  onClose,
  onSave,
}) => {
  useBlur({ isBlur: true });

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className={`modal ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className="modal-content-heading">
          <div className="modal-content-heading-text">{title}</div>
          <CancelIcon className="close-icon" onClick={onClose} />
        </div>
        <div className="modal-content-body">{children}</div>
        {footerButtonText && (
          <div className="modal-content-footer">
            <button type="button" className="modal-content-footer-button" onClick={onSave}>
              {saveLoading ? <LoadingIcon className="modal-content-footer-button-icon" /> : footerButtonText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
