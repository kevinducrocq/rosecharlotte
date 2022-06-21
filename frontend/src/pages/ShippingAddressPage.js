import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
  const [lastName, setLastname] = useState(shippingAddress.lastName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [zip, setZip] = useState(shippingAddress.zip || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { firstName, lastName, address, zip, city, country },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ firstName, lastName, address, zip, city, country })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>Adresse de livraison</Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-5">Adresse de livraison</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Code postal</Form.Label>
            <Form.Control
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Pays</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continuer
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
