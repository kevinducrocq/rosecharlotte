import React from 'react';
import { Image, Modal } from 'react-bootstrap';

export default function ModalTissuPatch(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <div className="text-center p-3">
        <Image fluid src={props.image} />
      </div>
    </Modal>
  );
}
