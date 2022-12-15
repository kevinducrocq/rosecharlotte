import {
  faCreditCard,
  faRightToBracket,
  faTruck,
  faTruckFast,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Row } from "react-bootstrap";

export default function CheckoutSteps(props) {
  return (
    <>
      <Row className="checkout-steps bg-light p-3 rounded-3 shadow d-none d-md-flex">
        <Col md={3} className={props.step1 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faRightToBracket} size="2x" /> &nbsp;
          <span>Connexion</span>
        </Col>
        <Col md={3} className={props.step2 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faTruck} size="2x" /> &nbsp;
          <span>Livraison</span>
        </Col>
        <Col md={3} className={props.step3 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faCreditCard} size="2x" /> &nbsp;
          <span> Moyen de paiement</span>
        </Col>
        <Col md={3} className={props.step4 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faTruckFast} size="2x" /> &nbsp;
          <span>Commande et paiement</span>
        </Col>
      </Row>

      <Row className="checkout-steps bg-light p-3 rounded-3 shadow d-flex d-md-none">
        <Col className={props.step1 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faRightToBracket} size="2x" /> &nbsp;
        </Col>
        <Col className={props.step2 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faTruck} size="2x" /> &nbsp;
        </Col>
        <Col className={props.step3 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faCreditCard} size="2x" /> &nbsp;
        </Col>
        <Col className={props.step4 ? "active mb-2" : "mb-2"}>
          <FontAwesomeIcon icon={faTruckFast} size="2x" /> &nbsp;
        </Col>
      </Row>
    </>
  );
}
