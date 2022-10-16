import React, { useReducer, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';

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

      const data = await response.data;
      const cardElement = elements.getElement(CardElement);
      const confirmPayment = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
      );
      const { paymentIntent } = confirmPayment;
      console.log(paymentIntent);

      if (paymentIntent.status === 'succeeded') {
        dispatch({ type: 'IS_PAID_SUCCESS' });
        toast.success('Paiement accepté, merci !');

        setTimeout(async () => {
          const paymentId = paymentIntent.id;
          console.log(paymentId);
          const paymentSuccess = await axios.post('/api/orders/stripe/check', {
            paymentId,
            clientSecret: data.clientSecret,
            orderId: order._id,
          });
          console.log(paymentSuccess);
          setTimeout(() => {
            onSuccess();
            setLoader(false);
          }, 3000);
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
      <CardElement
        className="form-control"
        style={{
          base: {
            lineHeight: '3',
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
        {loader ? <LoadingBox /> : ''}
      </div>
    </Form>
  );
}

export default CheckoutForm;
