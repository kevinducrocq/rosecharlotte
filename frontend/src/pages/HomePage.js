import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import CarouselFade from '../components/Carousel';
import { Link } from 'react-router-dom';

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
  const options = {
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      600: {
        items: 2,
      },
      800: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/last-products', {baseURL: 'http://localhost:9123', });
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

  const soldeProducts = products.filter((product) => {
    return !!product.soldePrice;
  });

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
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {soldeProducts.length > 0 ? (
              <section className="mt-3 mb-5">
                <h2>Les dernières soldes</h2> &nbsp;
                <Button className="bg3" variant="outline-light">
                  <Link to={'/soldes'}>Voir tout</Link>
                </Button>
                <hr />
                <Row>
                  <OwlCarousel
                    className="slider-items owl-carousel owl-theme"
                    {...options}
                    id="slider_soldes"
                  >
                    <div className="item">
                      {soldeProducts.slice(0, 8).map((product) => (
                        <div key={product.slug} className="item">
                          <Product product={product}></Product>
                        </div>
                      ))}
                    </div>
                  </OwlCarousel>
                </Row>
              </section>
            ) : (
              ''
            )}

            {promoProducts.length > 0 ? (
              <section className="mt-5 mb-5">
                <h2>Les dernières poromotions</h2> &nbsp;
                <button className="homepage-button">
                  <Link to={'/promotions'}>Voir tout</Link>
                </button>
                <hr />
                <Row>
                  <OwlCarousel
                    className="slider-items owl-carousel"
                    {...options}
                    id="slider_promos"
                  >
                    {promoProducts.slice(0, 8).map((product) => (
                      <div key={product.slug} className="item">
                        <Product product={product}></Product>
                      </div>
                    ))}
                  </OwlCarousel>
                </Row>
              </section>
            ) : (
              ''
            )}

            <section>
              <h2 className="mb-3">Les derniers produits</h2>
              <div>
                <Row>
                  {products.slice(0, 8).map((product) => (
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
              </div>
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default HomePage;
