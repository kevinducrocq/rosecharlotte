import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import { Link } from "react-router-dom";
import CarouselHome from "../components/Carousel";
import SearchBox from "../components/SearchBox";
import { toast } from "react-toastify";
import { getError } from "../utils";

import { LazyLoadImage } from "react-lazy-load-image-component";
import SlickCarousel from "../components/SlickCarousel";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomePage() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  const [promoProducts, setPromoProducts] = useState("");
  const [soldeProducts, setSoldeProducts] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products/last-products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/promos`);
        setPromoProducts(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/soldes`);
        setSoldeProducts(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const responsiveCarousel = [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  const renderPromoCarousel = () => {
    if (promoProducts.length > 0) {
      return (
        <div className="mt-3 mb-5">
          <div className="d-flex justify-content-between">
            <h2>Les dernières promotions</h2>&nbsp;
            <Button className="homepage-button" variant="outline-light">
              <Link to={"/promotions"}>Voir toutes les promotions</Link>
            </Button>
          </div>
          <hr />
          {promoProducts.length > 4 ? (
            <SlickCarousel
              {...{
                dots: true,
                slidesToShow: 4,
                slidesToScroll: 2,
                speed: 500,
                responsive: responsiveCarousel,
              }}
            >
              {promoProducts.slice(0, 12).map((product) => (
                <div key={product.slug}>
                  <Product product={product} />
                </div>
              ))}
            </SlickCarousel>
          ) : (
            <Row>
              {promoProducts.slice(0, 4).map((product) => {
                return (
                  <Col
                    key={product.slug}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-3 d-flex flex-column"
                  >
                    <Product product={product} />
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      );
    } else {
      return "";
    }
  };

  const renderSoldesCarousel = () => {
    if (soldeProducts.length > 0) {
      return (
        <div className="mt-3 mb-5">
          <div className="d-flex justify-content-between">
            <h2>Les dernières soldes</h2>&nbsp;
            <Button className="homepage-button" variant="outline-light">
              <Link to={"/soldes"}>Voir toutes les soldes</Link>
            </Button>
          </div>
          <hr />
          {soldeProducts.length > 4 ? (
            <SlickCarousel
              {...{
                dots: true,
                slidesToShow: 4,
                slidesToScroll: 2,
                speed: 500,
                responsive: responsiveCarousel,
              }}
            >
              {soldeProducts.slice(0, 12).map((product) => (
                <div key={product.slug}>
                  <Product product={product} />
                </div>
              ))}
            </SlickCarousel>
          ) : (
            <Row>
              {soldeProducts.slice(0, 4).map((product) => {
                return (
                  <Col
                    key={product.slug}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-3 d-flex flex-column"
                  >
                    <Product product={product} />
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>RoseCharlotte & Compagnie</title>
      </Helmet>

      <h1 className="d-none">Rose Charlotte & Compagnie</h1>

      <section className="carousel-home">
        <div className="d-none d-lg-block d-md-block d-md-none">
          <CarouselHome />
        </div>
        <div className="d-flex bg3">
          <div className="flex-fill bg4 btrr-lg mt-4"></div>
          <div className="bg4">
            <div className="text-center bg3 bbr-lg p-3">
              <LazyLoadImage
                src="../logo-hiver.png"
                alt="Rose Charlotte"
                width={280}
                className="img-fluid mb-3 mt-3"
                placeholderSrc="../Spinner.svg"
              />
            </div>
          </div>
          <div className="flex-fill bg4 btlr-lg mt-4"></div>
        </div>
        <div className="mt-3 p-3 d-lg-none d-md-block">
          <SearchBox />
        </div>
      </section>

      <Container>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {renderPromoCarousel()}
            {renderSoldesCarousel()}

            <section className="mt-3">
              <div className="d-flex justify-content-between">
                <h2>Les derniers produits</h2> &nbsp;
                <Button className="homepage-button" variant="outline-light">
                  <Link to={"/boutique/search?category=all"}>Voir tout</Link>
                </Button>
              </div>
              <hr />
              <div>
                <Row>
                  {(products ? products : []).slice(0, 8).map((product) => (
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      lg={3}
                      className="mb-3 d-flex flex-column"
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
