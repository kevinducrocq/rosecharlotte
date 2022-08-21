import {
  faArrowRightToBracket,
  faPen,
  faShoppingCart,
} from '@fortawesome/pro-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

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

  return (
    <>
      <div className="fixed-top">
        <Navbar variant="light" expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand></Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100 justify-content-end">
                <Link className="nav-link" to="/">
                  Accueil
                </Link>
                <Link className="nav-link" to="/boutique/search">
                  Boutique
                </Link>
                <Link className="nav-link" to="/about">
                  A propos
                </Link>
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>

                <Link to="/cart" className="nav-link bg4 rounded-5 ms-4">
                  <FontAwesomeIcon icon={faShoppingCart} /> Panier{' '}
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Navbar.Collapse>

            <div className="mx-4 p-2 d-flex justify-content-between">
              <span className="mx-2">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </span>
              <span>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </span>
            </div>
          </Container>
        </Navbar>

        <Nav className="navbar2">
          <Container className="d-flex">
            <div className="d-flex">
              {categories.map((category) => (
                <LinkContainer
                  to={`/boutique/search?category=${category}`}
                  key={category}
                >
                  <Link className="nav-link" to={category}>
                    {category}
                  </Link>
                </LinkContainer>
              ))}
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
                <Link className="mx-2 nav-link" to="/signin">
                  <FontAwesomeIcon icon={faArrowRightToBracket} /> Connexion
                </Link>
              )}
              {!userInfo && (
                <Link className="mx-2 nav-link" to="/signup">
                  <FontAwesomeIcon icon={faPen} /> Inscription
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
