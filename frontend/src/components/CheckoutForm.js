import React, { useReducer } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const CheckoutForm = ({ order, reducer }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [{}, dispatch] = useReducer(reducer, {});

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
        const { id } = paymentMethod;
        const response = await axios.post('/api/orders/stripe/charge', {
          amount: order.totalPrice * 100,
          id: id,
          orderId: order._id,
        });
        if (response.data.success) {
          dispatch({ type: 'IS_PAID_SUCCESS' });
          toast.success('Paiement accepté, merci !');
        }
      } catch (error) {
        dispatch({ type: 'IS_PAID_FAIL' });
        toast.error(getError(error));
      }
    } else {
      toast.error(getError(error));
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <Form.Label>Payer par carte bancaire</Form.Label>
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
      <div className="mt-2 text-center">
        <Button onClick={handleSubmit} className="w-100">
          Payer
        </Button>
      </div>
    </Form>
  );
};

export default CheckoutForm;
