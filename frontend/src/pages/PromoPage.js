import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PromoPage() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/last-products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const promoProducts = products.filter((product) => {
    return !!product.promoPrice;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Les dernières promos</title>
      </Helmet>

      <Container className="my-5">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {promoProducts.length > 0 ? (
              <section className="mt-5">
                <h2>Les dernières promotions</h2>
                <Row>
                  {promoProducts.map((product) => (
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      lg={3}
                      className="mb-3"
                    >
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
              </section>
            ) : (
              <MessageBox variant="info">
                Il n'y a pas de promotions pour le moment,{' '}
                <Link to={'/boutique/search?category=all'}>
                  voir la boutique
                </Link>
              </MessageBox>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default PromoPage;
