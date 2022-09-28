import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps bg-light p-3 rounded-3 shadow">
      <Col md={3} className={props.step1 ? 'active mb-2' : 'mb-2'}>
        Connexion
      </Col>
      <Col md={3} className={props.step2 ? 'active mb-2' : 'mb-2'}>
        Livraison
      </Col>
      <Col md={3} className={props.step3 ? 'active mb-2' : 'mb-2'}>
        Paiement
      </Col>
      <Col md={3} className={props.step4 ? 'active mb-2' : 'mb-2'}>
        Commande et paiement
      </Col>
    </Row>
  );
}
