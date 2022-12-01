import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
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
  const { userInfo } = state;
  const storeCart = state.cart;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const [discount, setDiscount] = useState(0);

  const [cart, setCart] = useState({ ...storeCart });

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const recalculatePrices = () => {
    const newCart = { ...cart };
    newCart.itemsPrice = round2(
      newCart.cartItems.reduce(
        (price, item) =>
          price + item.quantity * (item.price || item.variant.price),
        0
      )
    );

    newCart.itemsPriceWithDiscount = round2(
      (newCart.itemsPrice * (100 - discount)) / 100
    );

    const totalWeight = newCart.cartItems.reduce((weight, item) => {
      if (item.variant) {
        return weight + item.quantity * item.variant.weight;
      }
      return weight + item.quantity * item.weight;
    }, 0);
    newCart.itemsWeight = totalWeight;

    const deliveryPrice = () => {
      if (newCart.deliveryMethod === 'Local') {
        return 0;
      }

      if (totalWeight <= 200 && newCart.itemsPriceWithDiscount < 99) {
        return 4.4;
      } else if (
        totalWeight >= 200 &&
        totalWeight <= 250 &&
        newCart.itemsPriceWithDiscount < 99
      ) {
        return 5.4;
      } else if (totalWeight >= 250 && newCart.itemsPriceWithDiscount < 99) {
        return 6.9;
      } else if (newCart.itemsPriceWithDiscount >= 99) {
        return 0;
      }
    };

    newCart.shippingPrice = deliveryPrice();

    newCart.totalPrice = round2(
      newCart.itemsPriceWithDiscount + newCart.shippingPrice
    );
    setCart(newCart);
  };

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          deliveryMethod: cart.deliveryMethod,
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

  useEffect(() => {
    recalculatePrices();
    const userOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/orders-by-user`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        if (data.length === 0) {
          setDiscount(0);
        }
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    userOrders();
  }, [userInfo.token]);

  useEffect(() => {
    recalculatePrices();
  }, [discount]);

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // if (!cart.itemsPrice) {
  //   return <div></div>;
  // }

  return (
    <Container className="my-5">
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>Récapitulatif de commande</Helmet>
      <h1 className="my-5">Récapitulatif de la commande</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3 bg-light">
            {cart.deliveryMethod === 'Local' ? (
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>Commande à retirer dans nos Locaux</Card.Title>
                  <Card.Text>
                    <strong>Addresse : </strong> 20 rue Principale <br />
                    <strong>Code postal :</strong> 62190 <br />
                    <strong>Ville : </strong> Ecquedecques
                  </Card.Text>
                </div>
                <div className="text-nowrap">
                  <Link to="/shipping">
                    <FontAwesomeIcon icon={faPenToSquare} /> Modifier
                  </Link>
                </div>
              </Card.Body>
            ) : (
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>Livraison</Card.Title>
                  <Card.Text>
                    <strong>Nom | Prénom : </strong> {cart.shippingAddress.name}
                    <br />
                    <strong>Adresse : </strong> {cart.shippingAddress.address},{' '}
                    {cart.shippingAddress.zip}, {cart.shippingAddress.city}{' '}
                    <br />
                    <strong>Pays : </strong> {cart.shippingAddress.country}
                  </Card.Text>
                </div>
                <div className="text-nowrap">
                  <Link to="/shipping">
                    <FontAwesomeIcon icon={faPenToSquare} /> Modifier
                  </Link>
                </div>
              </Card.Body>
            )}
          </Card>

          <Card className="mb-3 bg-light">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Paiement</Card.Title>
                <Card.Text>
                  <strong>Méthode:</strong> {cart.paymentMethod}
                </Card.Text>
              </div>
              <div className="text-nowrap">
                <Link to="/payment">
                  <FontAwesomeIcon icon={faPenToSquare} /> Modifier
                </Link>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-3 bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>Produits</Card.Title>
                </div>
                <div className="text-nowrap">
                  <Link to="/cart">
                    <FontAwesomeIcon icon={faPenToSquare} /> Modifier
                  </Link>
                </div>
              </div>
              <ListGroup className="mb-3 text-center rounded-3">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item
                    key={item._id + item.variant?._id}
                    className="shadow p-3"
                  >
                    <Row className="align-items-center">
                      <Col md={4} className="d-flex flex-column">
                        <Link to={`/product/${item.slug}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            className="rounded-3 img-thumbnail"
                          />
                          <div>{item.name}</div>
                        </Link>
                      </Col>

                      <Col md={4}>
                        {item.variant ? (
                          <div>
                            <strong>Modèle :</strong> {item.variant.name}
                          </div>
                        ) : (
                          ''
                        )}
                        {item.fil ? (
                          <div>
                            <strong>Fil :</strong> {item.fil}
                          </div>
                        ) : (
                          ''
                        )}
                        {item.tissu ? (
                          <div>
                            <strong>Tissu :</strong> {item.tissu}
                          </div>
                        ) : (
                          ''
                        )}
                        {item.patch ? (
                          <div>
                            <strong>Motif broderie :</strong> {item.patch}
                          </div>
                        ) : (
                          ''
                        )}
                        {item.customization ? (
                          <div>
                            <strong>Texte : </strong>
                            {item.customization}
                          </div>
                        ) : (
                          ''
                        )}
                        {item.side ? (
                          <div>
                            <strong>Style : </strong>
                            {item.side}
                          </div>
                        ) : (
                          ''
                        )}
                      </Col>

                      <Col md={2}>
                        <span>x {item.quantity}</span>
                      </Col>

                      <Col md={2}>
                        {item.price || item.variant.price} &euro;
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-light shadow">
            <Card.Body>
              <Card.Title className="text-center mb-2">
                Montant de la commande
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Produits</Col>
                    <Col>{cart.itemsPrice?.toFixed(2)} &euro;</Col>
                  </Row>
                </ListGroup.Item>

                {discount > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <>
                        <Col>Remise {discount}%</Col>
                        <Col>
                          {(
                            (cart.itemsPrice ?? 0) -
                            (cart.itemsPriceWithDiscount ?? 0)
                          ).toFixed(2)}{' '}
                          &euro;
                        </Col>
                      </>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Row>
                    <Col>Livraison</Col>

                    <Col>
                      {cart.shippingPrice === 0
                        ? 'Offerte'
                        : cart.shippingPrice?.toFixed(2) + ' €'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total de la commande</Col>
                    <Col>{cart.totalPrice?.toFixed(2)} &euro;</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      className="bg1"
                      variant="outline-light"
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
