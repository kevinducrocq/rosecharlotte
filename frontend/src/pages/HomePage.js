import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import CarouselFade from '../components/Carousel';

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

function HomePage() {
  const [{ loading, error, products, isVisible }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      loading: true,
      error: '',
    }
  );

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
  return (
    <Container>
      <Helmet>
        <title>RoseCharlotte</title>
      </Helmet>

      <section>
        <div className="title mb-3">
          <img
            src="../logo-site.png"
            alt="Rose Charlotte"
            width={150}
            className="img-fluid mb-3"
          />
          <h1 className="text-center">
            Bienvenue sur Rose Charlotte & Compagnie
          </h1>
        </div>
        <CarouselFade />
      </section>
      <section className="mt-5">
        <h2 className="mb-3">Les derniers produits</h2>
        <div>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.slice(0, 8).map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      <section className="mt-5">
        <h2>Les avis des clients</h2>
      </section>
    </Container>
  );
}

export default HomePage;
