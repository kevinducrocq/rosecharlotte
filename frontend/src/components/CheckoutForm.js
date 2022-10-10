import React, { useReducer, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';

function CheckoutForm({ order, reducer, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [{}, dispatch] = useReducer(reducer, {});
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setLoader(true);
      const response = await axios.post('/api/orders/stripe/pay', {
        amount: order.totalPrice * 100,
        orderId: order._id,
      });
      setLoader(true);
      const data = await response.data;
      const cardElement = elements.getElement(CardElement);
      const confirmPayment = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
      );
      console.log(confirmPayment);
      const { paymentIntent } = confirmPayment;

      if (paymentIntent.status === 'succeeded') {
        dispatch({ type: 'IS_PAID_SUCCESS' });
        toast.success('Paiement accepté, merci !');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        toast.error('Il y a eu une erreur lors du paiement');
      }
    } catch (error) {
      dispatch({ type: 'IS_PAID_FAIL' });
      toast.error(getError(error));
      onSuccess();
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div className="mb-2 text-center">Payer par carte bancaire</div>
      <CardElement
        className="form-control"
        style={{
          base: {
            lineHeight: '1.6',
          },
        }}
        options={{
          hidePostalCode: true,
        }}
      />
      <div className="mb-2 text-center">
        <Button disabled={loader} onClick={handleSubmit} className="w-100 mt-2">
          Payer
        </Button>
      </div>
    </Form>
  );
}

export default CheckoutForm;
