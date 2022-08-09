import {
  faArrowRightToBracket,
  faPen,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import SearchBox from './SearchBox';

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
      <Navbar variant="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Rose Charlotte</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-50 mx-4">
              <SearchBox />
            </Nav>
            <Nav className="me-auto w-100 justify-content-end">
              <Link className="nav-link" to="/">
                Accueil
              </Link>
              <Link className="nav-link" to="/search">
                Boutique
              </Link>
              <Link className="nav-link" to="/about">
                A propos
              </Link>
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profil</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Historique</NavDropdown.Item>
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
                <Link className="nav-link" to="/signin">
                  <FontAwesomeIcon icon={faArrowRightToBracket} /> Connexion
                </Link>
              )}

              {!userInfo && (
                <Link className="nav-link" to="/signup">
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
                </NavDropdown>
              )}
              <Link to="/cart" className="nav-link">
                <FontAwesomeIcon icon={faShoppingCart} /> Panier{' '}
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="navbar2">
        <div className="container d-flex">
          {categories.map((category) => (
            <LinkContainer
              to={`/search?category=${category}`}
              key={category}
              className="mx-2"
            >
              <Link className="nav-link" to={category}>
                {category}
              </Link>
            </LinkContainer>
          ))}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
