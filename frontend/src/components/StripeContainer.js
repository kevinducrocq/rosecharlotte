import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const PUBLIC_KEY =
  'pk_test_51Lqh9bC3E0acuJ6Jju3YfmPFiSUmjmBsyJAmadK737WFxz8i0ohv84MRXGomknkDoi5uyr4Sygyt5kZEq7CNvTDv00860YzrVi';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = ({ order, reducer }) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm order={order} reducer={reducer} />
    </Elements>
  );
};

export default Stripe;
