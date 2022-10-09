import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const PUBLIC_KEY =
  'pk_live_51Lqh9bC3E0acuJ6J1sLJmV493tvgTMmgqkMcsAYp88JT4LVBiMYjSJGMy5JxvST5NJVpeemoZVVN2WyoJ70m0agx00jvkSY986';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = ({ order, reducer, onSuccess }) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm order={order} reducer={reducer} onSuccess={onSuccess} />
    </Elements>
  );
};

export default Stripe;
