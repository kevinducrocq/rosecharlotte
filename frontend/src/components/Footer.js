import React from 'react';

import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg1 text-white p-3">
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col md={4} className="text-center d-none d-sm-block mb-3">
            <Image src="../logo-site.png" width={150} />
          </Col>

          <Col md={4} className="text-center mb-3 footer-link">
            <Link className="nav-link mb-2" to="/">
              Accueil
            </Link>
            <Link className="nav-link mb-2" to="/boutique/search">
              Boutique
            </Link>
            <Link className="nav-link mb-2" to="/about">
              A propos
            </Link>
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </Col>
          <Col md={4} className="text-center footer-link">
            <Link className="nav-link mb-2" to="/cgv">
              Condition générales de vente
            </Link>
            <Link className="nav-link mb-2" to="/mentions">
              Mentions Légales
            </Link>
            <Link className="nav-link" to="/serviceclient">
              Service Client
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
