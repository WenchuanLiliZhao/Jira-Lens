/**
 * Modal Trigger
 *
 * Wraps a child element (e.g. Button) to open the modal on click.
 */

import React, { useEffect } from 'react';
import { useModalContext } from './context';
import type { ModalTriggerProps } from './types';

export const ModalTrigger: React.FC<ModalTriggerProps> = ({ children, className, ...rest }) => {
  const { openModal, disabled, setTriggerRef } = useModalContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTriggerRef(ref as React.RefObject<HTMLElement | null>);
    return () => setTriggerRef(null);
  }, [setTriggerRef]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    openModal();
    (rest.onClick as React.MouseEventHandler<HTMLDivElement>)?.(e);
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={handleClick}
      style={{ display: 'inline-block' }}
      {...rest}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ disabled?: boolean }>, {
            disabled: disabled || (children as React.ReactElement<{ disabled?: boolean }>).props?.disabled,
          })
        : children}
    </div>
  );
};

ModalTrigger.displayName = 'Modal.Trigger';
