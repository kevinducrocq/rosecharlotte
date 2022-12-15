import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import { useReducer } from "react";
import L from "leaflet";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function MondialRelayPage() {
  const [dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: false,
  });
  const [codePostal, setCodePostal] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let icon = L.icon({
    iconUrl: "../marker.svg",
    iconRetinaUrl: "../marker.svg",
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [40, 40],
  });

  const { dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  const [pointsMondialRelay, setPointsMondialRelay] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [lat, setLat] = useState(48.866667);
  const [lng, setLng] = useState(2.333333);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const [chosenPointRelais, setChozenPointRelais] = useState([]);

  async function getPointsMondialRelay() {
    try {
      if (codePostal.length === 5) {
        const result = await axios.get(`/api/mondialRelay/${codePostal}`);
        setPointsMondialRelay(result.data[0].PointRelais_Details);

        let lat = 0,
          lng = 0;
        result.data[0].PointRelais_Details.map((pm) => {
          lat += parseFloat(pm.Latitude.replace(",", "."));
          lng += parseFloat(pm.Longitude.replace(",", "."));
        });

        lat = lat / result.data[0].PointRelais_Details.length;
        lng = lng / result.data[0].PointRelais_Details.length;

        setLat(lat);
        setLng(lng);
      } else {
        toast.error("Le code postal saisi n'est pas correct");
      }
    } catch (err) {
      toast.error("Le code postal saisi n'existe pas");
    }
  }

  const updatePointRelais = () => {
    handleClose();
    setChozenPointRelais("");
  };

  const submitHandler = async () => {
    try {
      ctxDispatch({
        type: "SAVE_DELIVERY_METHOD",
        payload: "Mondial Relay",
      });
      localStorage.setItem("deliveryMethod", "Mondial Relay");

      ctxDispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: {
          name: chosenPointRelais[0],
          address: chosenPointRelais[1],
          zip: chosenPointRelais[2],
          city: chosenPointRelais[3],
          country: chosenPointRelais[4],
        },
      });
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify({
          name: chosenPointRelais[0],
          address: chosenPointRelais[1],
          zip: chosenPointRelais[2],
          city: chosenPointRelais[3],
          country: chosenPointRelais[4],
        })
      );
      navigate("/payment");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Adresse de livraison</title>
      </Helmet>

      <div className="my-5">
        <CheckoutSteps step1 step2></CheckoutSteps>
      </div>

      <Row>
        <div className="">
          <Link
            to={"/shipping"}
            className="mb-3 btn btn-md bg-secondary text-white"
          >
            Retour
          </Link>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            getPointsMondialRelay();
          }}
        >
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Votre code postal"
              value={codePostal}
              onChange={(e) => {
                setCodePostal(e.target.value);
              }}
              className=""
              required
            />
            <Button variant="outline-secondary" id="button-addon" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup>
        </Form>
        <Col md={4} className="bg-white p-2 rounded-3 mb-3 order-2 order-md-1">
          <div className="scroll">
            <ListGroup variant="flush">
              {pointsMondialRelay.map((pm) => {
                return (
                  <ListGroup.Item key={pm.Num}>
                    <Row>
                      <Col md={8}>
                        <b>{pm.LgAdr1}</b>
                        <div>{pm.LgAdr3.toLowerCase()}</div>
                        <div>{pm.CP}</div>
                        <div>{pm.Ville}</div>
                      </Col>
                      <Col md={4} className="align-self-center">
                        <Button
                          className="btn btn-sm bg1 float-end"
                          variant="outline-light"
                          onClick={(e) => {
                            handleShow(true);
                            setChozenPointRelais([
                              pm.LgAdr1,
                              pm.LgAdr3,
                              pm.CP,
                              pm.Ville,
                              pm.Pays,
                            ]);
                          }}
                        >
                          Choisir
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Col>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="text-center">
              <div className="mb-3">
                Vous avez choisi : <br />
                <hr />
                <p>
                  <b> {chosenPointRelais[0]}</b> <br />
                  {chosenPointRelais[1]} <br />
                  {chosenPointRelais[2]} <br />
                  {chosenPointRelais[3]} <br />
                </p>
              </div>
            </div>
            <hr />
            <Row>
              <Col md={6}>
                <Button
                  onClick={() => {
                    submitHandler();
                    handleClose();
                  }}
                  className="bg1 w-100 mb-2"
                  variant="outline-light"
                >
                  Valider
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  onClick={() => {
                    updatePointRelais();
                  }}
                  className="bg-secondary w-100"
                  variant="outline-light"
                >
                  Retour
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Col md={8} className="order-1 order-md-2 mb-3">
          <MapContainer center={[lat, lng]} zoom={12} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pointsMondialRelay.map((pm) => {
              return (
                <Marker
                  key={pm.Num}
                  icon={icon}
                  position={[
                    parseFloat(pm.Latitude.replace(",", ".")),
                    parseFloat(pm.Longitude.replace(",", ".")),
                  ]}
                >
                  <Popup>
                    <div className="text-center">
                      <div>
                        <b>{pm.LgAdr1}</b>
                      </div>
                      <div>{pm.LgAdr3}</div>
                      <div>{pm.CP}</div>
                      <div className="mb-2">{pm.Ville}</div>
                      <Button
                        className="btn btn-sm bg1"
                        variant="outline-light"
                        onClick={(e) => {
                          handleShow(true);
                          setChozenPointRelais([
                            pm.LgAdr1,
                            pm.LgAdr3,
                            pm.CP,
                            pm.Ville,
                          ]);
                        }}
                      >
                        Choisir
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            <RecenterAutomatically lat={lat} lng={lng} />
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
}
