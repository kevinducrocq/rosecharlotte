import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Connexion</Col>
      <Col className={props.step2 ? 'active' : ''}>Adresse de livraison</Col>
      <Col className={props.step3 ? 'active' : ''}>Commande & paiement</Col>
    </Row>
  );
}
