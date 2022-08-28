import {
  faArrowRightToBracket,
  faPen,
  faReel,
  faShoppingCart,
} from '@fortawesome/pro-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import CategoriesCanvasMenu from './CategoriesCanvasMenu';

function NavigationBar() {
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

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <NavDropdown key={category} eventKey={category} title={category}>
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
              <Image src="../logo-site.png" width={60} />
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
          <Container className="d-flex">
            <div className="d-lg-none text-nowrap">
              <CategoriesCanvasMenu />
            </div>

            <div className="d-none d-lg-flex">{renderedCategories}</div>

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
                    <NavDropdown.Item>Tableau de bord</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/product/add">
                    <NavDropdown.Item>Ajouter un produit</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Produits</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Commandes</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/reviews">
                    <NavDropdown.Item>Commentaires</NavDropdown.Item>
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
