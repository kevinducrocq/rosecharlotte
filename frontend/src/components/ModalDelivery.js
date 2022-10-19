import React from 'react';

import { faHouse, faPersonCarryBox } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
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
  const [modalShow, setModalShow] = useState(false);

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

  const homeHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_DELIVERY_METHOD', payload: deliveryMethodName });
    localStorage.setItem('deliveryMethod', deliveryMethodName);
    localStorage.removeItem('shippingAddress');
    navigate('/payment');
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <Button
            className="bg2 text-light w-100 p-4 mb-2"
            variant="outline-secondary"
            onClick={() => setModalShow(true)}
          >
            <h6>À domicile</h6>
            <FontAwesomeIcon icon={faHouse} size="5x" />
          </Button>
        </Col>
        {/* <Col md={4}>
          <Button
            value="pointRelais"
            className="bg2 text-light w-100 p-4 mb-2"
            variant="outline-secondary"
            // onClick={(e) => setDeliveryMethod(e.target.value)}
          >
            <h6>Point relais</h6>
            <FontAwesomeIcon icon={faStore} size="5x" />
          </Button>
        </Col> */}
        <Col md={6}>
          <Form onSubmit={homeHandler}>
            <Button
              type="submit"
              className="bg2 text-light w-100 p-4"
              variant="outline-secondary"
              onClick={(e) => setDeliveryMethod('Local')}
            >
              <h6>Dans nos locaux</h6>
              <FontAwesomeIcon icon={faPersonCarryBox} size="5x" />
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Form onSubmit={submitHandler}>
          <Modal.Body closeButton className="my-4 p-4">
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

            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Pays</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="bg1 w-100"
              variant="outline-light"
              value="Domicile"
              onClick={(e) => setDeliveryMethod(e.target.value)}
            >
              Continuer
            </Button>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
}

export default DeliveryAddressModal;
