import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';
import { useReducer } from 'react';
import LoadingBox from '../components/LoadingBox';
import { LinkContainer } from 'react-router-bootstrap';

function reducer(state, action) {
  switch (action.type) {
    case 'SEND_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'SEND_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'SEND_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function ContactPage() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  async function sendEmail(e) {
    e.preventDefault();
    try {
      dispatch({ type: 'SEND_REQUEST' });
      await axios.post('/api/users/contact/send', {
        message,
        senderName,
        senderEmail,
      });
      dispatch({
        type: 'SEND_SUCCESS',
      });
      setMessage('');
      setSenderName('');
      setSenderEmail('');
      toast.success('Votre message a été envoyé');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'SEND_FAIL' });
    }
  }

  return (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Contact</Breadcrumb.Item>
      </Breadcrumb>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1 className="text-center">Contactez-nous</h1>

      <Row>
        <Col md={8} className="shadow bg3 p-5 offset-md-2 my-5 rounded-5">
          <Form onSubmit={sendEmail}>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Prénom et nom"
                name="senderName"
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Votre email"
                name="senderEmail"
                value={senderEmail}
                onChange={(e) => {
                  setSenderEmail(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Control
                placeholder="Votre message"
                as="textarea"
                rows={6}
                name="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                required
              />
            </Form.Group>
            <div className="mb-3">
              <Button
                type="submit"
                variant="outline-light"
                className="bg1 w-100"
              >
                Envoyer
              </Button>
              <div>{loading ? <LoadingBox /> : error}</div>
            </div>
          </Form>
        </Col>
        <hr />
      </Row>
      <div>
        <iframe
          title="RoseCharlotte"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2534.566493349316!2d2.4454355159352223!3d50.560831287285836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dd1b661ba15921%3A0xea27f9df1ebdcc6b!2sRose%20Charlotte%20%26%20Compagnie!5e0!3m2!1sfr!2sfr!4v1660560677058!5m2!1sfr!2sfr"
          width="100%"
          height={400}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
}
