import React, { useReducer, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const CheckoutForm = ({ order, reducer, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [{}, dispatch] = useReducer(reducer, {});
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log('Token généré', paymentMethod);

      // envoi du token au backend
      try {
        setLoader(true);
        const { id } = paymentMethod;
        const response = await axios.post('/api/orders/stripe/charge', {
          amount: order.totalPrice * 100,
          id: id,
          orderId: order._id,
        });
        setLoader(false);
        if (response.data.success) {
          dispatch({ type: 'IS_PAID_SUCCESS' });
          toast.success('Paiement accepté, merci !');
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } catch (error) {
        dispatch({ type: 'IS_PAID_FAIL' });
        toast.error(getError(error));
        onSuccess();
      }
    } else {
      toast.error(getError(error));
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
};

export default CheckoutForm;
