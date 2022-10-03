import React, { useContext, useReducer } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import axios from 'axios';
import { getError, dateFr } from '../utils';
import { Breadcrumb, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistoryPage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container className="my-5">
      <Breadcrumb>
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Historique de commandes</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>Historique de commandes</title>
      </Helmet>
      <h1 className="my-5">Historique de commandes</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox></MessageBox>
      ) : orders.length > 0 ? (
        <Table responsive className="table table-striped">
          <thead>
            <tr className="to-upper">
              <th>N°</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payé</th>
              <th>Livré</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 7)}</td>
                <td>{dateFr(order.createdAt)}</td>
                <td>{order.totalPrice.toFixed(2)} &euro;</td>
                <td>{order.isPaid ? dateFr(order.paidAt) : 'Non'}</td>
                <td>{order.isDelivered ? dateFr(order.deliveredAt) : 'Non'}</td>
                <td>
                  <Button
                    className="btn btn-sm"
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <MessageBox>
          Vous n'avez pas encore commandé <br />
          <Link to="/boutique/search">Voir la boutique</Link>
        </MessageBox>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
