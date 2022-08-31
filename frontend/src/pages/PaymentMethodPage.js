import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { Col, Container, Row } from 'react-bootstrap';
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

  let [paymentMethodName, setPaymentMethod] = useState('');

  // useEffect(() => {
  //   if (!shippingAddress.address) {
  //     navigate('/shipping');
  //   }
  // }, [shippingAddress, navigate]);

  const submitPaypalHandler = (e) => {
    e.preventDefault();
    if (paymentMethodName) {
      ctxDispatch({ type: 'PAYMENT_METHOD_CLEAR' });
    } else {
      paymentMethodName = 'PayPal';
      setPaymentMethod(paymentMethodName);
      ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
      localStorage.setItem('paymentMethod', paymentMethodName);
    }
    navigate('/placeorder');
  };

  const submitChequeHandler = (e) => {
    e.preventDefault();
    if (paymentMethodName) {
      ctxDispatch({ type: 'PAYMENT_METHOD_CLEAR' });
    } else {
      paymentMethodName = 'Chèque';
      setPaymentMethod(paymentMethodName);
      ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
      localStorage.setItem('paymentMethod', paymentMethodName);
    }
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
        <Row>
          <Col md={6}>
            <Form onSubmit={submitPaypalHandler}>
              <Button
                type="submit"
                value="PayPal"
                className="bg2 text-light w-100 p-4 mb-2"
                variant="outline-secondary"
              >
                <span>Carte bancaire ou PayPal</span>
                <div className="text-nowrap">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    size="5x"
                    className="me-1"
                  />
                  <FontAwesomeIcon
                    icon={faCcPaypal}
                    size="5x"
                    className="ms-1"
                  />
                </div>
              </Button>
            </Form>
          </Col>

          <Col md={6}>
            <Form onSubmit={submitChequeHandler}>
              <Button
                type="submit"
                value="Chèque"
                className="bg2 text-light w-100 p-4 mb-2"
                variant="outline-secondary"
              >
                <span>Chèque bancaire</span>
                <div>
                  <FontAwesomeIcon icon={faMoneyCheckPen} size="5x" />
                </div>
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
