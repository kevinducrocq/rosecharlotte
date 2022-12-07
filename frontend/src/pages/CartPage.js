import React, { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import {
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Container,
  Image,
  Breadcrumb,
} from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  faMinusCircle,
  faPlusCircle,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const itemsQuantity = cartItems.reduce((a, c) => a + c.quantity, 0);

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (item.variant) {
      const variantItem = data.variants.filter((v) => {
        return v._id === item.variant._id;
      })[0];

      if (variantItem.countInStock < quantity) {
        window.alert(
          "Désolé, il n'y a plus de quantité disponible pour ce produit"
        );
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });
    } else {
      if (data.countInStock < quantity) {
        window.alert(
          "Désolé, il n'y a plus de quantité disponible pour ce produit"
        );
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });
    }
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate(`/signin?redirect=/shipping`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Panier</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>Panier</title>
      </Helmet>
      <h1 className="my-5 text-center">Panier</h1>

      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Votre panier est vide,&nbsp;
              <Link to="/boutique/search">voir la boutique</Link>
            </MessageBox>
          ) : (
            <ListGroup className="text-center">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center my-3">
                    <Col md={3} className="d-flex flex-column">
                      <Link to={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          className="rounded-3 img-thumbnail"
                        />
                        <div>{item.name}</div>
                      </Link>
                    </Col>

                    <Col className="">
                      {item.variant ? (
                        <div>
                          <strong>Modèle :</strong> {item.variant.name}
                        </div>
                      ) : (
                        ''
                      )}
                      {item.fil ? (
                        <div>
                          <strong>Fil :</strong> {item.fil}
                        </div>
                      ) : (
                        ''
                      )}
                      {item.tissu ? (
                        <div>
                          <strong>Tissu :</strong> {item.tissu}
                        </div>
                      ) : (
                        ''
                      )}
                      {item.patch ? (
                        <div>
                          <strong>Motif :</strong> {item.patch}
                        </div>
                      ) : (
                        ''
                      )}
                      {item.customization ? (
                        <div>
                          <strong>Commentaire : </strong>
                          {item.customization}
                        </div>
                      ) : (
                        ''
                      )}
                      {item.side ? (
                        <div>
                          <strong>Style : </strong>
                          {item.side}
                        </div>
                      ) : (
                        ''
                      )}
                    </Col>

                    <Col md={3} className="text-nowrap">
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <FontAwesomeIcon icon={faMinusCircle} />{' '}
                      </Button>
                      <span className="mx-1">{item.quantity}</span>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </Button>
                    </Col>

                    <Col md={3}>
                      <s>{item.price || item.variant.price} &euro;</s>{' '}
                      <b>
                        {item.promoPrice ||
                        item.soldePrice ||
                        item.variant.promoPrice ||
                        item.variant.soldePrice
                          ? (item.promoPrice ?? item.soldePrice) ||
                            (item.variant.promoPrice ?? item.variant.soldePrice)
                          : item.price || item.variant.price}{' '}
                        &euro;
                      </b>
                    </Col>

                    <Col md={3}>
                      <div className="my-2">
                        <Button
                          className="btn btn-sm"
                          onClick={() => removeItemHandler(item)}
                          variant="danger"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className="shadow">
            <Card.Body className="bg4">
              <ListGroup variant="flush">
                <ListGroup.Item className="bg4">
                  <div className="text-center d-flex flex-column">
                    <h3 className="text-center">Sous-total</h3>
                    <span className="h6 text-muted">
                      ({cartItems.reduce((a, c) => a + c.quantity, 0)} produit
                      {itemsQuantity <= 1 ? '' : 's'})
                    </span>
                    <span className="h3">
                      {cartItems
                        .reduce(
                          (a, c) =>
                            a +
                            (c.promoPrice ||
                            c.soldePrice ||
                            c.variant.promoPrice ||
                            c.variant.soldePrice
                              ? (c.promoPrice ?? c.soldePrice) ||
                                (c.variant.promoPrice ?? c.variant.soldePrice)
                              : c.price || c.variant.price) *
                              c.quantity,
                          0
                        )
                        .toFixed(2)}{' '}
                      &euro;
                    </span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="bg4">
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="outline-light"
                      className="bg1"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Commander
                    </Button>
                    <div
                      className={
                        cartItems.length === 0 ? 'd-none' : 'mt-3 text-center'
                      }
                    >
                      <Link to={'/boutique/search'}>Continuer vos achats</Link>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
