import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcPaypal } from '@fortawesome/free-brands-svg-icons';
import {
  faCreditCard,
  faMoneyCheckPen,
} from '@fortawesome/pro-solid-svg-icons';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <Container className="my-5">
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container mt-5">
        <Helmet>
          <title>Moyen de paiement</title>
        </Helmet>
        <h1 className="my-5 text-center">Moyen de paiement</h1>

        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Button
                type="submit"
                value="paypal"
                className="bg2 text-light w-100 p-4"
                variant="outline-secondary"
                onClick={(e) => setPaymentMethod(e.target.value)}
              >
                <h6>Carte bancaire ou PayPal</h6>
                <FontAwesomeIcon
                  icon={faCreditCard}
                  size="5x"
                  className="mx-3"
                />
                &nbsp;
                <FontAwesomeIcon icon={faCcPaypal} size="5x" className="mx-3" />
              </Button>
            </Col>

            <Col md={6}>
              <Button
                type="submit"
                value="cheque"
                className="bg2 text-light w-100 p-4"
                variant="outline-secondary"
                onClick={(e) => setPaymentMethod(e.target.value)}
              >
                <h6>Chèque bancaire</h6>
                <FontAwesomeIcon icon={faMoneyCheckPen} size="5x" />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
}
