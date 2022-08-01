import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Connexion</Col>
      <Col className={props.step2 ? 'active' : ''}>Adresse</Col>
      <Col className={props.step3 ? 'active' : ''}>Paiement</Col>
      <Col className={props.step4 ? 'active' : ''}>Commande et paiement</Col>
    </Row>
  );
}
