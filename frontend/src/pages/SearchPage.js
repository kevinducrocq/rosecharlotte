import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import SearchBox from '../components/SearchBox';

import { Accordion, Badge, Breadcrumb, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import CategoriesCanvasMenu from '../components/CategoriesCanvasMenu';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const subCategory = sp.get('subCategory') || 'all';
  const otherCategory = sp.get('otherCategory') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/boutique/search?page=${page}&query=${query}&category=${category}&subCategory=${subCategory}&otherCategory=${otherCategory}&price=${price}&order=${order}`,
          {baseURL: 'http://localhost:9123', }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, subCategory, otherCategory, error, order, price, query, page]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`, {baseURL: 'http://localhost:9123', });
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterSubCategory = filter.subCategory || subCategory;
    const filterOtherCategory = filter.otherCategory || otherCategory;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/boutique/search?category=${filterCategory}&subCategory=${filterSubCategory}&otherCategory=${filterOtherCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
  };

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <Accordion.Item key={category} eventKey={category}>
        <Accordion.Header>{category}</Accordion.Header>
        <Accordion.Body>
          <div className="d-flex flex-column categories-menu">
            <Link
              className="nav-link cat-link p-2 rounded-3"
              to={`/boutique/search?category=${category}`}
            >
              Tous les produits {category}
            </Link>
            {categories[category].map((key) => {
              return (
                <div key={key}>
                  <Link
                    to={`/boutique/search?subCategory=${key}`}
                    className="nav-link sub-cat-link p-2 rounded-3"
                  >
                    {key}
                  </Link>
                </div>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <Container className="my-5">
      <Breadcrumb>
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={'/boutique/search'}>
          <Breadcrumb.Item>Boutique</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/boutique/search?category=${category}`}>
          <Breadcrumb.Item>{category ? category : ''}</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/boutique/search?subCategory=${subCategory}`}>
          <Breadcrumb.Item active>{subCategory}</Breadcrumb.Item>
        </LinkContainer>
      </Breadcrumb>

      <Helmet>
        <title>Boutique</title>
      </Helmet>
      <h1 className="text-center">Boutique</h1>
      <Row className="my-5 align-items-center">
        <Col md={10} className="mt-2">
          <SearchBox />
        </Col>
        <Col md={2} className="mt-2">
          <div className="text-center text-nowrap">
            Filtrer{' '}
            <select
              value={order}
              onChange={(e) => {
                navigate(getFilterUrl({ order: e.target.value }));
              }}
            >
              <option value="newest">Les nouveaux produits</option>
              <option value="lowest">Prix : du - au +</option>
              <option value="highest">Prix : du + au -</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="text-center mb-2 d-none d-lg-block d-md-block">
            <h4>Catégories</h4>
            <Link
              className="badge nav-link bg1 p-2"
              variant="outline-light"
              to={'/boutique/search?category=all'}
            >
              Voir tout
            </Link>
          </div>

          <div className="boutique-categories-menu">
            <div className="d-lg-none d-md-none text-nowrap mb-3">
              <CategoriesCanvasMenu />
            </div>
            {loading ? (
              <LoadingBox className="d-none d-sm-block d-lg-block"></LoadingBox>
            ) : error ? (
              <MessageBox
                variant="danger"
                className="d-none d-sm-block d-lg-block"
              >
                {error}
              </MessageBox>
            ) : (
              <Accordion className="d-none d-lg-block d-md-block">
                {renderedCategories}
              </Accordion>
            )}
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'Pas de ' : countProducts} résultat
                    {countProducts <= 1 ? '' : 's'}
                    {price !== 'all' && ' : Prix ' + price}
                    {query !== 'all' ||
                    category !== 'all' ||
                    subCategory !== 'all' ||
                    otherCategory !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        className="btn btn-sm bg-secondary ms-2"
                        onClick={() => navigate('/boutique/search')}
                      >
                        <Badge bg="secondary">
                          {query !== 'all' && ' ' + '"' + query + '"'}
                        </Badge>
                        <FontAwesomeIcon icon={faTimesCircle} /> EFFACER
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>Pas de résultat</MessageBox>
              )}

              <Row>
                <Row>
                  {products.map(
                    (product) =>
                      product.isVisible === true && (
                        <Col key={product._id} sm={6} lg={4} className="mb-3">
                          <Product product={product}></Product>
                        </Col>
                      )
                  )}
                </Row>
              </Row>
              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
