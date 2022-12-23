import React from "react";
import { Image, Modal } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ModalZoomImage(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <div className="text-center p-3">
        <LazyLoadImage
          placeHolderSrc="../Spinner.svg"
          className="img-fluid"
          src={props.image}
        />
      </div>
    </Modal>
  );
}
