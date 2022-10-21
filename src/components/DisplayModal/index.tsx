import { Modal } from 'antd';
import type { ReactNode } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useState } from 'react';

interface DisplayModalProps {
  component: ReactNode;
  width: number;
  title: ReactNode;
  footer: ReactNode | string | null;
  onCloseCallback: (() => void) | null;
}

const DisplayModal = forwardRef(
  ({ width, title, component, footer = null, onCloseCallback }: DisplayModalProps, ref) => {
    const [open, setOpen] = useState(false);

    const showModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
      onCloseCallback?.();
    };

    useImperativeHandle(ref, () => ({
      handleShowModal: showModal,
    }));

    return (
      <Modal
        title={title}
        width={width}
        open={open}
        destroyOnClose={true}
        onCancel={closeModal}
        footer={footer}
      >
        {component}
      </Modal>
    );
  },
);

export default DisplayModal;
