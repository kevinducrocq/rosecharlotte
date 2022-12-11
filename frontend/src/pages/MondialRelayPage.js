import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import 'leaflet/dist/leaflet.css';

export default function MondialRelayPage() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5">
      <Helmet>
        <title>Adresse de livraison</title>
      </Helmet>

      <div className="my-5">
        <CheckoutSteps step1 step2></CheckoutSteps>
      </div>

      <Row>
        <Col md={3}>
          <div>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Votre code postal"
                className="w-50"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <Button variant="outline-secondary" id="button-addon2">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </div>
          <div>Liste des points relais</div>
        </Col>
        <Col md={9}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
}
