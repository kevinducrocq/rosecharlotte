import React, { useContext, useReducer } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import { faPenToSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderPage() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  const totalWeight = (cart.itemsWeight = cart.cartItems.reduce(
    (a, c) => a + c.quantity * c.weight,
    0
  ));

  const deliveryPrice = () => {
    if (totalWeight <= 200 && cart.itemsPrice <= 85) {
      return 4.4;
    } else if (
      totalWeight >= 200 &&
      totalWeight <= 250 &&
      cart.itemsPrice <= 85
    ) {
      return 5.4;
    } else if (totalWeight >= 250 && cart.itemsPrice <= 85) {
      return 6.9;
    } else if (cart.itemsPrice >= 85) {
      return 0;
    }
  };

  cart.shippingPrice = deliveryPrice();

  cart.totalPrice = round2(cart.itemsPrice + cart.shippingPrice);
  console.log(cart.totalPrice);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE-SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Container className="my-5">
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>Récapitulatif de commande</Helmet>
      <h1 className="my-5">Récapitulatif de la commande</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Livraison</Card.Title>
              <Card.Text>
                <strong>Nom | Prénom : </strong> {cart.shippingAddress.name}
                <br />
                <strong>Adresse : </strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.zip}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.country} <br />
              </Card.Text>
              <Link to="/shipping">
                <FontAwesomeIcon icon={faPenToSquare} /> Modifier
              </Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Produits</Card.Title>
              <ListGroup variant="flush" className="mb-2">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>{item.price} &euro;</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">
                <FontAwesomeIcon icon={faPenToSquare} /> Modifier
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body className="shadow">
              <Card.Title className="text-center mb-2">
                Montant de la commande
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Produits</Col>
                    <Col>{cart.itemsPrice.toFixed(2)} &euro;</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Livraison</Col>

                    <Col>
                      {cart.shippingPrice === 0
                        ? 'Offerte'
                        : cart.shippingPrice.toFixed(2)}
                      &euro;
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total de la commande</Col>
                    <Col>{cart.totalPrice.toFixed(2)} &euro;</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Commander
                    </Button>
                    <div>{loading && <LoadingBox></LoadingBox>}</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
