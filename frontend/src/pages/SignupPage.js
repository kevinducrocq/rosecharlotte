import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';

export default function SignupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
      }, {baseURL: 'http://localhost:9123', });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="my-5 small-container">
      <Helmet>
        <title>Inscription</title>
      </Helmet>

      <Row>
        <Col md={8} className="offset-md-2 bg3 p-5 rounded shadow">
          <h1 className="my-3 text-center">Inscription</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nom et Prénom</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type={passwordIsVisible ? 'text' : 'password'}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                >
                  <FontAwesomeIcon
                    icon={passwordIsVisible ? faEyeSlash : faEye}
                  />
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Répéter votre mot de passe</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type={confirmPasswordIsVisible ? 'text' : 'password'}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={() =>
                    setConfirmPasswordIsVisible(!confirmPasswordIsVisible)
                  }
                >
                  <FontAwesomeIcon
                    icon={confirmPasswordIsVisible ? faEyeSlash : faEye}
                  />
                </Button>
              </InputGroup>
            </Form.Group>
            <div className="mb-3">
              <Button
                type="submit"
                className="w-100 bg1"
                variant="outline-light"
              >
                Inscription
              </Button>
            </div>
            <div className="mb-3">
              Déjà client ?{' '}
              <Link to={`/signin?redirect=${redirect}`}>Connectez-vous!</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
