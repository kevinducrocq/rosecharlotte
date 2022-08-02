import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/AdminMenu';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container className="my-5">
      <Row>
        <Col md={2}>
          <AdminMenu link1 />
        </Col>
        <Col md={10} className="shadow p-5">
          <h1>Tableau de bord</h1>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row>
                <Col md={4} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.users && summary.users[0]
                          ? summary.users[0].numUsers
                          : 0}
                      </Card.Title>
                      <Card.Text> Users</Card.Text>
                      <Link to="/admin/users">Voir</Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0].numOrders
                          : 0}
                      </Card.Title>
                      <Card.Text> Commandes</Card.Text>
                      <Link to="/admin/orders">Voir</Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0].totalSales.toFixed(2)
                          : 0}{' '}
                        &euro;
                      </Card.Title>
                      <Card.Text> Total</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
