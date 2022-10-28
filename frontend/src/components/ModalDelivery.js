import React from 'react';

import {
  faForward,
  faHouse,
  faPersonCarryBox,
  faStore,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { useReducer } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function DeliveryAddressModal() {
  const [{ loading, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [name, setName] = useState(userInfo.name || shippingAddress.name);
  const [address, setAddress] = useState(
    userInfo.address || shippingAddress.address
  );
  const [zip, setZip] = useState(userInfo.zip || shippingAddress.zip);
  const [city, setCity] = useState(userInfo.city || shippingAddress.city);
  const [country, setCountry] = useState(
    userInfo.country || shippingAddress.country
  );

  const [deliveryMethodName, setDeliveryMethod] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalSaveAddressShow, setModalSaveAddressShow] = useState(false);
  const handleClose = () => setModalSaveAddressShow(false);
  const handleShow = () => setModalSaveAddressShow(true);

  const [formIsVisible, setFormIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const updateUserAddress = async () => {
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          address,
          zip,
          city,
          country,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Votre adresse a été mise à jour dans votre profil');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const submitHandler = async () => {
    try {
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
      ctxDispatch({
        type: 'SAVE_DELIVERY_METHOD',
        payload: deliveryMethodName,
      });
      localStorage.setItem('deliveryMethod', deliveryMethodName);
      navigate('/payment');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const homeHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_DELIVERY_METHOD', payload: deliveryMethodName });
    localStorage.setItem('deliveryMethod', deliveryMethodName);
    localStorage.removeItem('shippingAddress');
    navigate('/payment');
  };

  const buttonChangeAddress = () => {
    return (
      <Button
        className="bg-secondary w-100"
        variant="outline-light"
        onClick={() => {
          setFormIsVisible(true);
          resetForm();
        }}
      >
        Livrer ailleurs
      </Button>
    );
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setZip('');
    setCity('');
    setCountry('');
  };

  const renderUserAddress = () => {
    if (formIsVisible || !userInfo.address) {
      return renderAddressForm();
    }

    return (
      <>
        <div className="mb-4 text-center">
          <span>Votre adresse</span>
          <hr />
          <div>{userInfo.name}</div>
          <div>{userInfo.address}</div>
          <div>{userInfo.zip}</div>
          <div>{userInfo.city}</div>
          <div>{userInfo.country}</div>
          <hr />
        </div>
        <Row>
          <Col>
            <Button
              className="bg1 w-100"
              variant="outline-light"
              onClick={() => {
                setDeliveryMethod('Domicile');
                submitHandler();
              }}
            >
              Livrer à cette adresse
            </Button>
          </Col>
          <Col>{buttonChangeAddress()}</Col>
        </Row>
      </>
    );
  };

  const renderAddressForm = () => {
    return (
      <Form>
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
          className="bg1 w-100"
          variant="outline-light"
          onClick={() => {
            handleShow(true);
            setModalShow(false);
          }}
        >
          Continuer
        </Button>
      </Form>
    );
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <Button
            className="bg2 text-light w-100 p-4 mb-2"
            variant="outline-secondary"
            onClick={() => {
              setModalShow(true);
              setDeliveryMethod('Domicile');
            }}
          >
            <h6>À domicile</h6>
            <FontAwesomeIcon icon={faHouse} size="5x" />
          </Button>
        </Col>
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

        <Modal.Body className="p-4">{renderUserAddress()}</Modal.Body>
      </Modal>

      <Modal
        show={modalSaveAddressShow}
        onHide={() => setModalSaveAddressShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="text-center">
            Voulez-vous sauvegarder cette adresse dans votre profil ?
          </div>
          <Row>
            <Col md={6}>
              <Button
                onClick={() => {
                  updateUserAddress();
                  submitHandler();
                  handleClose();
                }}
                className="bg1 w-100"
                variant="outline-light"
              >
                Oui
              </Button>
            </Col>
            <Col md={6}>
              <Button
                onClick={() => {
                  handleClose();
                  submitHandler();
                }}
                className="bg-secondary w-100"
                variant="outline-light"
              >
                Non
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DeliveryAddressModal;
