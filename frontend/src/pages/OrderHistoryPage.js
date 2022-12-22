import React, { useContext, useReducer, useRef, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import axios from "axios";
import { getError, dateFr, logOutAndRedirect } from "../utils";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
  Tooltip,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import { LazyLoadImage } from "react-lazy-load-image-component";
import SlickCarousel from "../components/SlickCarousel";
import { faChevronCircleDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistoryPage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        // .catch(function (error) {
        //   if (error.response && error.response.status === 401) {
        //     logOutAndRedirect();
        //   }
        // });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={"/"} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Historique de commandes</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>Historique de commandes</title>
      </Helmet>
      <h1 className="my-5">Historique de commandes</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox></MessageBox>
      ) : orders.length > 0 ? (
        <Container>
          {orders.map((order) => {
            return (
              <Card className="mb-3">
                <Card.Header>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex justify-content-start">
                        <p className="mb-2 me-3">
                          Commandé le <br />
                          <small className="text-muted">
                            {dateFr(order.createdAt)}
                          </small>
                        </p>
                        <p className="mb-2 mx-3">
                          Total <br />
                          <small className="text-muted">
                            {order.totalPrice.toFixed(2)} &euro;
                          </small>
                        </p>
                        <p className="mb-2 ms-3">
                          Livraison <br />
                          <small className="text-muted">
                            <OverlayTrigger
                              trigger="click"
                              placement="bottom"
                              overlay={
                                order.shippingAddress ? (
                                  <Popover id={order._id}>
                                    <Popover.Header className="bg1 text-white">
                                      {order.shippingAddress.name}
                                    </Popover.Header>
                                    <Popover.Body>
                                      {order.shippingAddress.address}
                                      <br />
                                      {order.shippingAddress.zip}
                                      <br />
                                      {order.shippingAddress.city}
                                      <br />
                                    </Popover.Body>
                                  </Popover>
                                ) : (
                                  ""
                                )
                              }
                            >
                              {order.deliveryMethod != "Local" ? (
                                <div role="button">
                                  {order.deliveryMethod}&nbsp;
                                  <FontAwesomeIcon icon={faChevronCircleDown} />
                                </div>
                              ) : (
                                <div>{order.deliveryMethod}</div>
                              )}
                            </OverlayTrigger>
                          </small>
                        </p>
                      </div>
                    </Col>

                    <Col md={4} className="mb-2">
                      <div className="d-flex flex-column align-items-stard align-items-md-end">
                        <div>
                          Commande N°&nbsp;
                          <small className="text-muted">{order._id}</small>
                        </div>
                        <div>
                          <Link to={`/order/${order._id}`}>
                            Voir les détails
                          </Link>
                          &nbsp;|&nbsp; <Link to="">Facture</Link>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="bg-light">
                  <Row>
                    <Col md={6} className="mt-2 mb-md-3 mb-5">
                      <div className="mb-3">
                        {order.isDelivered
                          ? "Expédiée le " + dateFr(order.deliveredAt)
                          : "Commande en attente d'expédition"}
                      </div>

                      <SlickCarousel
                        {...{
                          dots: true,
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          speed: 500,
                        }}
                      >
                        {order.orderItems.map((item) => (
                          <div className="d-flex">
                            <div className="mx-3">
                              <LazyLoadImage
                                src={item.image}
                                className="img-fluid"
                                width={80}
                              />
                            </div>
                            <div>
                              <div>{item.name}</div>
                              <div>Modèle : {item.variant?.name}</div>
                              <div>
                                {item.promoPrice ||
                                item.soldePrice ||
                                item.variant?.promoPrice ||
                                item.variant?.soldePrice ? (
                                  <>
                                    <s>{item.price || item.variant.price}</s>
                                    &euro;&nbsp;|&nbsp;
                                  </>
                                ) : (
                                  ""
                                )}
                                <b>
                                  {item.promoPrice ||
                                  item.soldePrice ||
                                  item.variant?.promoPrice ||
                                  item.variant?.soldePrice
                                    ? (item.promoPrice ?? item.soldePrice) ||
                                      (item.variant?.promoPrice ??
                                        item.variant?.soldePrice)
                                    : item.price || item.variant.price}
                                  &nbsp;&euro;
                                </b>
                              </div>
                              <div>
                                <Link to={`/product/${item.slug}`}>
                                  Voir le produit
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </SlickCarousel>
                    </Col>

                    <Col
                      md={4}
                      className="offset-md-2 d-flex flex-column justify-content-center align-items-center"
                    >
                      <Button
                        className="w-100 btn-sm bg-white text-dark mb-2"
                        variant="outline-secondary"
                      >
                        Click
                      </Button>

                      <Button
                        className="w-100 btn-sm bg-white text-dark mb-2"
                        variant="outline-secondary"
                      >
                        Click
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
        </Container>
      ) : (
        <MessageBox>
          Vous n'avez pas encore commandé <br />
          <Link to="/boutique/search">Voir la boutique</Link>
        </MessageBox>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
