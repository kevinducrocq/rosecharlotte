import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import DeliveryAddressModal from '../components/ModalDeliveryAddress';

export default function ShippingAddressScreen() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Container className="my-5">
      <Helmet>
        <title>Adresse de livraison</title>
      </Helmet>

      <div className="my-5">
        <CheckoutSteps step1 step2></CheckoutSteps>
      </div>

      <div className="container my-5 small-container">
        <DeliveryAddressModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </Container>
  );
}
