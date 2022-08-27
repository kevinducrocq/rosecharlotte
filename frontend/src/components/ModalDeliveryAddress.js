import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

function DeliveryAddressModal(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [name, setName] = useState(shippingAddress.name || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [zip, setZip] = useState(shippingAddress.zip || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [country, setCountry] = useState(shippingAddress.city || '');

  const [deliveryMethodName, setDeliveryMethod] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        name,
        address,
        zip,
        city,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        name,
        address,
        zip,
        city,
        country,
      })
    );
    ctxDispatch({ type: 'SAVE_DELIVERY_METHOD', payload: deliveryMethodName });
    localStorage.setItem('deliveryMethod', deliveryMethodName);
    navigate('/payment');
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={submitHandler}>
        <Modal.Body closeButton>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Prénom et nom</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="zip">
            <Form.Label>Code postal</Form.Label>
            <Form.Control
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Pays</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="bg1 w-100"
            variant="outline-light"
            value="domicile"
            onClick={(e) => setDeliveryMethod(e.target.value)}
          >
            Continuer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DeliveryAddressModal;
