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
import { useParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);

  const params = useParams();
  const { id: userId, token } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/users/reset-password/${userId}/${token}`, {
        password,
        confirmPassword,
      });
      toast.success('Votre mot de passe a été réinitialisé');
      navigate('/signin');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="my-5 small-container ">
      <Helmet>
        <title>Nouveau mot de passe</title>
      </Helmet>
      <Row>
        <Col md={8} className="offset-md-2 bg3 p-5 rounded shadow">
          <h1 className="my-3 text-center">Nouveau mot de passe</h1>
          <Form onSubmit={submitHandler}>
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
