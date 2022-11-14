import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../../Store';
import { getError, logOutAndRedirect } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminMenu from '../../components/AdminMenu';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';
import Chart from 'react-google-charts';

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
        const { data } = await axios
          .get('/api/orders/summary', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
          .catch(function (error) {
            if (error.response && error.response.status === 401) {
              logOutAndRedirect();
            }
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
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link1 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>
        <Col md={10} className="shadow p-5">
          <h1 className="mb-3">Tableau de bord</h1>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row>
                <Col md={3} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.users && summary.users[0]
                          ? summary.users[0]?.numUsers
                          : 0}
                      </Card.Title>
                      <Card.Text> Utilisateurs inscrits</Card.Text>
                      <Link to="/admin/users" className="homepage-button">
                        Voir
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0]?.numOrders
                          : 0}
                      </Card.Title>
                      <Card.Text> Commandes</Card.Text>
                      <Link to="/admin/orders" className="homepage-button">
                        Voir
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.products && summary.products[0]
                          ? summary.products[0]?.numProducts
                          : 0}
                      </Card.Title>
                      <Card.Text> Produits</Card.Text>
                      <Link to="/admin/products" className="homepage-button">
                        Voir
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="my-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0]?.totalSales?.toFixed(2)
                          : 0}{' '}
                        &euro;
                      </Card.Title>
                      <Card.Text> Total</Card.Text> <br />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <hr />
              <Row className="my-3">
                <Col md={6} className="my-3">
                  <h2 className="text-center mb-3">Catégories</h2>
                  {summary.productCategories.length === 0 ? (
                    <MessageBox>Pas encore de catégories</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<div>Chargement du graphique</div>}
                      data={[
                        ['Category', 'Products'],
                        ...summary.productCategories.map((x) => [
                          x._id,
                          x.count,
                        ]),
                      ]}
                    />
                  )}
                </Col>
                <Col md={6} className="my-3">
                  <h2 className="text-center mb-3">Ventes</h2>
                  {summary.dailyOrders.length === 0 ? (
                    <MessageBox>Pas encore de vente</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      loader={<div>Chargement du graphique</div>}
                      data={[
                        ['Date', 'Sales'],
                        ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                      ]}
                    ></Chart>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
