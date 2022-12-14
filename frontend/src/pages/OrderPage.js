import React, { useReducer, useContext, useEffect, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    case 'IS_PAID_REQUEST':
      return { ...state, loadingIsPaid: true };
    case 'IS_PAID_SUCCESS':
      return { ...state, loadingIsPaid: false, successIsPaid: true };
    case 'IS_PAID_FAIL':
      return { ...state, loadingIsPaid: false };
    case 'IS_PAID_RESET':
      return {
        ...state,
        loadingIsPaid: false,
        successIsPaid: false,
      };
    default:
      return state;
  }
}

export default function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [showModalCheque, setShowModalCheque] = useState(false);

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
      loadingIsPaid,
      successIsPaid,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
    isPaid: false,
    loadingIsPaid: false,
    loadingDeliver: false,
    isDelivered: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Commande pay??e avec succ??s');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        if (data.paymentMethod === 'Ch??que' && !data.isPaid) {
          setShowModalCheque(true);
        }
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      successIsPaid ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successIsPaid) {
        dispatch({ type: 'IS_PAID_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'EUR' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
    successIsPaid,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('La commande a ??t?? marqu??e comme envoy??e');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  async function payOrderHandler() {
    try {
      dispatch({ type: 'IS_PAID_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/is-paid`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'IS_PAID_SUCCESS', payload: data });
      toast.success('La commande a ??t?? marqu??e comme pay??e');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'IS_PAID_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container>
      <Helmet>
        <title>Commande {orderId}</title>
      </Helmet>
      <h1 className="my-5">
        Commande <br />
        <small>N?? {orderId.substring(0, 7)}</small>
      </h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            {order.shippingAddress ? (
              <Card.Body>
                <Card.Title>Livraison</Card.Title>
                <Card.Text>
                  <strong>Nom | Pr??nom :</strong> {order.shippingAddress.name}{' '}
                  <br />
                  <strong>Adresse : </strong> {order.shippingAddress.address},{' '}
                  {order.shippingAddress.zip}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.country} <br />
                </Card.Text>
              </Card.Body>
            ) : (
              <Card.Body>
                <Card.Title>Commande ?? r??cup??rer pour : </Card.Title>
                <strong>Nom | Pr??nom : </strong> {order.user.name} <br />
                <strong>Email : </strong> {order.user.email}
              </Card.Body>
            )}
            <Card.Body>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Commande livr??e le {order.deliveredAt.substring(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Pas encore livr??</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Paiement</Card.Title>
              <div className="text-muted mb-3">{order.paymentMethod}</div>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Pay?? le {order.paidAt.substring(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Pas encore pay??</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3 bg-light">
            <Card.Body>
              <Card.Title>Produits</Card.Title>
              <ListGroup className="mb-3 text-center rounded-3">
                {order.orderItems.map((item) => (
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
                        <span>{item.variant?.name}</span>
                      </Col>

                      <Col md={2}>
                        <span>x {item.quantity}</span>
                      </Col>

                      <Col md={2}>{item.price} &euro;</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Montant de la commande</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="shadow rounded-3">
                  <Row>
                    <Col>Produits</Col>
                    <Col>{order.itemsPrice.toFixed(2)} &euro;</Col>
                  </Row>
                  <Row>
                    <Col>Livraison</Col>
                    <Col>{order.shippingPrice.toFixed(2)} &euro;</Col>
                  </Row>
                  <Row>
                    <Col>
                      <strong>Total de la commande</strong>
                    </Col>
                    <Col>
                      <strong>{order.totalPrice.toFixed(2)} &euro;</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && order.paymentMethod === 'PayPal' && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {!order.isPaid && order.paymentMethod === 'Ch??que' && (
                  <>
                    <ListGroup.Item className="shadow rounded-3 text-center">
                      <p>
                        Merci d'envoyer le ch??que, ?? l'ordre de{' '}
                        <strong>"Rose Charlotte &amp; Compagnie"</strong> ??
                        l'adresse suivante :&nbsp;
                      </p>
                      <p className="text-center">
                        Rose Charlotte & Compagnie <br /> 20 rue Principale{' '}
                        <br />
                        62190 Ecquedecques
                      </p>
                    </ListGroup.Item>
                    {!userInfo.isAdmin && (
                      <Modal
                        show={showModalCheque}
                        onHide={() => {
                          setShowModalCheque(false);
                        }}
                        dialogClassName="custom-modal"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-lg">
                            Paiement par Ch??que
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>
                            Merci de l'envoyer, ?? l'ordre de{' '}
                            <strong>"Rose Charlotte &amp; Compagnie"</strong> ??
                            l'adresse suivante :
                          </p>
                          <p className="text-center">
                            Rose Charlotte & Compagnie <br /> 20 rue Principale
                            <br /> 62190 Ecquedecques
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            className="bg1"
                            variant="outline-light no-border"
                            onClick={() => {
                              setShowModalCheque(false);
                            }}
                          >
                            Femer
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    )}
                  </>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button
                        type="button"
                        variant="outline-light"
                        className="bg1"
                        onClick={deliverOrderHandler}
                      >
                        Livrer
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin &&
                  !order.isPaid &&
                  !order.isDelivered &&
                  order.paymentMethod === 'Ch??que' && (
                    <ListGroup.Item>
                      {loadingIsPaid && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <Button
                          type="button"
                          variant="outline-light"
                          className="bg1"
                          onClick={payOrderHandler}
                        >
                          Ch??que re??u
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
