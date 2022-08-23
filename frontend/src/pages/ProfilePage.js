import React, { useContext, useReducer, useState } from 'react';
import {
  Accordion,
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import { LinkContainer } from 'react-router-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfilePage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(userInfo.address);
  const [zip, setZip] = useState(userInfo.zip);
  const [city, setCity] = useState(userInfo.city);
  const [country, setCountry] = useState(userInfo.country);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          address,
          zip,
          city,
          country,
        },
        { baseURL: 'http://localhost:9123', headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Votre profil a été mis à jour', { autoClose: 2000 });
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const updtadePasswordHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error('Les mots de passe ne correspondent pas');
    } else {
      try {
        const { data } = await axios.put(
          '/api/users/profile',
          {
            password,
          },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'UPDATE_SUCCESS' });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        toast.success('Votre mot de passe a été mis à jour', {
          autoClose: 2000,
        });
      } catch (err) {
        dispatch({ type: 'UPDATE_FAIL' });
        toast.error(getError(err));
      }
    }
  };

  return (
    <>
      <Container className="my-5">
        <Breadcrumb>
          <LinkContainer to={'/'} exact>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Profil</Breadcrumb.Item>
        </Breadcrumb>

        <div className=" container bg3 shadow rounded-3 p-4 small-container">
          <Helmet>
            <title>Profil</title>
          </Helmet>

          <h1 className="my-3 mb-5 text-center">Profil de {userInfo.name}</h1>

          <Form onSubmit={submitHandler} className="mb-5">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Nom et Prénom</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    autoCapitalize
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="zip">
                  <Form.Label>Code postal</Form.Label>
                  <Form.Control
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="city">
                  <Form.Label>Ville</Form.Label>
                  <Form.Control
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Pays</Form.Label>
                  <Form.Control
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <Button
                className="bg1 w-100"
                variant="outline-light"
                type="submit"
              >
                {loadingUpdate ? <LoadingBox /> : 'Mettre à jour'}
              </Button>
            </div>
          </Form>

          <hr />

          <Accordion>
            <Accordion.Item eventKey="0" className="bg3">
              <Accordion.Header>Changer le mot de passe</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updtadePasswordHandler}>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group className="" controlId="password">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                          autoComplete="new-password"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="" controlId="confirmPassword">
                        <Form.Label>Répétez le Mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <Button
                      className="bg1 w-100"
                      variant="outline-light"
                      type="submit"
                    >
                      {loadingUpdate ? <LoadingBox /> : 'Enregistrer'}
                    </Button>
                  </div>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </>
  );
};

export default ProfilePage;
