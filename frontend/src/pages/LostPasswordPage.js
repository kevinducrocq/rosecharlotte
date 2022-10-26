import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function LostPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/users/forgot-password',
        {
          email,
        },
        console.log('POST ok')
      );
      toast.success(
        'Un email contenant un lien de réinitialisation a été envoyé'
      );
      console.log('Email ok');
      navigate('/');
    } catch (err) {
      console.log('POST pas ok');
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5 small-container ">
      <Helmet>
        <title>Mot de passe oublié</title>
      </Helmet>
      <Row>
        <Col md={8} className="offset-md-2 bg3 p-5 rounded shadow">
          <h1 className="my-3 text-center">Mot de passe oublié</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <div className="mb-3">
              <Button
                type="submit"
                className="bg1 w-100"
                variant="outline-light"
              >
                Envoyer
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
