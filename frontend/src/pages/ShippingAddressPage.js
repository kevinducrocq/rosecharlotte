import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Container, Row, Col } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faPersonCarryBox,
  faStore,
} from '@fortawesome/pro-solid-svg-icons';
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
        <Row>
          <Col>
            <Button
              value="domicile"
              className="bg2 text-light w-100 p-4"
              variant="outline-secondary"
              // onClick={(e) => setDeliveryMethod(e.target.value)}
              onClick={() => setModalShow(true)}
            >
              <h6>À domicile</h6>
              <FontAwesomeIcon icon={faHouse} size="5x" />
            </Button>
          </Col>
          <Col>
            <Button
              value="pointRelais"
              className="bg2 text-light w-100 p-4"
              variant="outline-secondary"
              // onClick={(e) => setDeliveryMethod(e.target.value)}
            >
              <h6>Point relais</h6>
              <FontAwesomeIcon icon={faStore} size="5x" />
            </Button>
          </Col>
          <Col>
            <Button
              value="domicile"
              className="bg2 text-light w-100 p-4"
              variant="outline-secondary"
              // onClick={(e) => setDeliveryMethod(e.target.value)}
            >
              <h6>Dans nos locaux</h6>
              <FontAwesomeIcon icon={faPersonCarryBox} size="5x" />
            </Button>
          </Col>
        </Row>
      </div>

      <DeliveryAddressModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
  );
}
