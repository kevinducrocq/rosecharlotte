import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcPaypal } from '@fortawesome/free-brands-svg-icons';
import { faMoneyCheckPen } from '@fortawesome/pro-solid-svg-icons';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

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
        <h1 className="my-3 text-center">Moyen de paiement</h1>

        <Form onSubmit={submitHandler}>
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <div className="mx-2">
              <Form.Check
                type="radio"
                id="PayPal"
                value="PayPal"
                label="Carte bancaire ou Paypal"
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
            <div>
              <FontAwesomeIcon icon={faCcPaypal} size="5x" />
            </div>
          </div>
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <div className="mx-2">
              <Form.Check
                type="radio"
                id="cheque"
                label="Chèque bancaire"
                value="cheque"
                checked={paymentMethodName === 'cheque'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
            <div>
              <FontAwesomeIcon icon={faMoneyCheckPen} size="5x" />
            </div>
          </div>
          <div className="mb-3">
            <Button type="submit" className="w-100 bg1">
              Continuer
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
