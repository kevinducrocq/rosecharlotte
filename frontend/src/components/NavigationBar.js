import React from 'react';

import {
  faArrowRightToBracket,
  faBagShopping,
  faClothesHanger,
  faComments,
  faGauge,
  faPen,
  faPlus,
  faShoppingCart,
  faUsers,
} from '@fortawesome/pro-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import CategoriesCanvasMenu from './CategoriesCanvasMenu';
import { useReducer } from 'react';

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

function NavigationBar() {
  const [{ products }, dispatch] = useReducer(reducer, {
    products: [],
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    window.location.href = '/signin';
  };

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
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products/last-products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  const promoProducts = products.filter((product) => {
    return !!product.promoPrice;
  });

  const soldeProducts = products.filter((product) => {
    return !!product.soldePrice;
  });

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <NavDropdown
        key={category}
        eventKey={category}
        title={category}
        className="dropdown-barre"
      >
        <LinkContainer to={`/boutique/search?category=${category}`}>
          <NavDropdown.Item>Tous les produits {category}</NavDropdown.Item>
        </LinkContainer>

        {categories[category].map((key) => {
          return (
            <LinkContainer
              to={`/boutique/search?subCategory=${key}`}
              className="nav-link text-dark"
              key={key}
            >
              <NavDropdown.Item>{key}</NavDropdown.Item>
            </LinkContainer>
          );
        })}
      </NavDropdown>
    );
  });

  return (
    <>
      <div className="fixed-top shadow">
        <Navbar variant="light" expand="lg" collapseOnSelect={true}>
          <Container>
            <LinkContainer to="/">
              <Image src="../logo-site.png" width={150} />
            </LinkContainer>

            <Nav>
              <Nav.Link eventKey="i">
                <Link to="/cart" className="nav-link mobile-cart">
                  <div className="cart-link">
                    <FontAwesomeIcon icon={faShoppingCart} /> Panier{' '}
                    {cart.cartItems.length > 0 && (
                      <div className="bg1 text-white rounded-5 badge">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </div>
                    )}
                  </div>
                </Link>
              </Nav.Link>
            </Nav>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="m-auto menu-principal align-items-center">
                <Nav.Link eventKey="i">
                  <Link className="nav-link" to="/">
                    Accueil
                  </Link>
                </Nav.Link>
                <Nav.Link eventKey="i">
                  <Link className="nav-link" to="/boutique/search">
                    Boutique
                  </Link>
                </Nav.Link>

                {promoProducts.length > 0 && (
                  <Nav.Link eventKey="i">
                    <Link className="nav-link" to="/promotions">
                      Promotions
                    </Link>
                  </Nav.Link>
                )}

                {soldeProducts.length > 0 && (
                  <Nav.Link eventKey="i">
                    <Link className="nav-link" to="/soldes">
                      Soldes
                    </Link>
                  </Nav.Link>
                )}

                <Nav.Link eventKey="i">
                  <Link className="nav-link" to="/about">
                    A propos
                  </Link>
                </Nav.Link>
                <Nav.Link eventKey="i">
                  <Link className="nav-link" to="/contact">
                    Contact
                  </Link>
                </Nav.Link>

                <a
                  href="https://www.facebook.com/Rose-Charlotte-compagnie-261590004642619"
                  target="_blank"
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a
                  href="https://www.instagram.com/rosecharlotteetcie/"
                  target="_blank"
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              </Nav>

              <Nav>
                <Nav.Link eventKey="i">
                  <Link to="/cart" className="nav-link site-cart">
                    <div className="cart-link">
                      <FontAwesomeIcon icon={faShoppingCart} /> Panier{' '}
                      {cart.cartItems.length > 0 && (
                        <div className="bg3 text-dark rounded-5 badge">
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </div>
                      )}
                    </div>
                  </Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Nav className="navbar2">
          <Container className="d-flex align-items-center">
            <div className="d-lg-none text-nowrap">
              <CategoriesCanvasMenu />
            </div>

            <div className="d-none d-lg-flex flex-wrap">
              {renderedCategories}
            </div>

            <div className="d-flex ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profil</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Mes commandes</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Déconnexion
                  </Link>
                </NavDropdown>
              ) : (
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/signin"
                >
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                  <span className="ms-1">Connexion</span>
                </Link>
              )}
              {!userInfo && (
                <Link
                  className="nav-link d-flex align-items-center d-none d-md-flex"
                  to="/signup"
                >
                  <FontAwesomeIcon icon={faPen} />{' '}
                  <span className="ms-1">Inscription</span>
                </Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faGauge} />
                      &nbsp; Tableau de bord
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/product/add">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faPlus} />
                      &nbsp; Ajouter un produit
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faClothesHanger} />
                      &nbsp; Produits
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBagShopping} />
                      &nbsp; Commandes
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faUsers} />
                      &nbsp; Utilisateurs
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/reviews">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faComments} />
                      &nbsp; Commentaires
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </div>
          </Container>
        </Nav>
      </div>
    </>
  );
}

export default NavigationBar;
