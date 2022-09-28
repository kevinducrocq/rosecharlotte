import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function LoadingBox() {
  return (
    <div className="mt-5 mb-3 d-flex justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
