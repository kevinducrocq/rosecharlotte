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
  return (
    <>
      <Helmet>
        <title>RoseCharlotte & Compagnie</title>
      </Helmet>

      <h1 className="d-none">Rose Charlotte & Compagnie</h1>
      <section>
        <CarouselFade />
        <div className="d-flex bg3">
          <div className="flex-fill bg4 btrr-lg mt-4"></div>
          <div className="bg4">
            <div className="text-center bg3 bbr-lg p-4">
              <img
                src="../logo-site.png"
                alt="Rose Charlotte"
                width={150}
                className="img-fluid mb-3 mt-2"
              />
            </div>
          </div>
          <div className="flex-fill bg4 btlr-lg mt-4"></div>
        </div>
      </section>

      <Container>
        <section>
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
          <h2>Les dernières promotions</h2>
          <Row>
            {products.slice(0, 8).map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </>
  );
}

export default HomePage;
