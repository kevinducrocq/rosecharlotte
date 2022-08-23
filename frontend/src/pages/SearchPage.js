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

import {
  Accordion,
  Badge,
  Container,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';

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

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/boutique/search?&query=${query}&category=${category}&subCategory=${subCategory}&otherCategory=${otherCategory}&price=${price}&order=${order}`
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
  }, [category, subCategory, otherCategory, error, order, price, query]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterSubCategory = filter.subCategory || subCategory;
    const filterOtherCategory = filter.otherCategory || otherCategory;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/boutique/search?category=${filterCategory}&subCategory=${filterSubCategory}&otherCategory=${filterOtherCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}`;
  };

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <Accordion.Item key={category} eventKey={category}>
        <Accordion.Header>{category}</Accordion.Header>
        <Accordion.Body>
          <div className="d-flex flex-column">
            <Link
              className="nav-link"
              to={`/boutique/search?category=${category}`}
            >
              Tous les produits {category}
            </Link>
            {categories[category].map((key) => {
              return (
                <Link
                  to={`/boutique/search?subCategory=${key}`}
                  className="nav-link"
                >
                  {key}
                </Link>
              );
            })}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  return (
    <Container className="my-5">
      <Helmet>
        <title>Boutique</title>
      </Helmet>
      <h1 className="text-center">Boutique</h1>
      <Row className="my-5 align-items-center">
        <Col md={10} className="mt-2">
          <SearchBox />
        </Col>
        <Col md={2} className="mt-2">
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
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="d-flex my-3">
            <h4>Catégories</h4>
            <Link
              className="badge align-items-center text-muted bg2 ms-5"
              to={'/boutique/search?category=all'}
            >
              Voir tout
            </Link>
          </div>

          <div className="boutique-categories-menu">
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <Accordion>{renderedCategories}</Accordion>
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
                    <h2>
                      {category === 'all' ? '' : ''}
                      {category !== 'all' && '' + ''}
                    </h2>

                    {price !== 'all' && ' : Prix ' + price}
                    {query !== 'all' ||
                    category !== 'all' ||
                    subCategory !== 'all' ||
                    otherCategory !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        className="btn btn-sm bg-secondary"
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
                  {products.map((product) => (
                    <Col key={product._id} sm={6} lg={4} className="mb-3">
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
