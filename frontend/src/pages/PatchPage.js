import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Breadcrumb,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ModalTissuPatch from '../components/ModalTissuPatch';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        patches: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function TissuPage() {
  const [{ loading, error, patches }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const [modalShow, setModalShow] = useState(false);

  const [patchImage, setPatchImage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/patches/');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Motifs Broderie</title>
      </Helmet>

      <Container className="my-5">
        <Breadcrumb className="d-none d-md-flex">
          <LinkContainer to={'/'} exact>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Motifs broderie</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <section className="mt-5">
              <div className="d-flex justify-content-between">
                <h2>Motifs Borderie</h2>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un motif..."
                  className="w-50"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <Row className="mt-5">
                {patches
                  .filter((val) => {
                    if (searchTerm === '') {
                      return val;
                    } else if (
                      val.name
                        .toLowerCase()
                        .includes(searchTerm.toLocaleLowerCase())
                    ) {
                      return val;
                    }
                    return '';
                  })
                  .map((patch) => (
                    <Col key={patch._id} md={4} sm={6} lg={3}>
                      <Card className="mb-3">
                        <Card.Header className="text-center">
                          <h2 className="h5">{patch.name}</h2>
                        </Card.Header>
                        <div className="text-center">
                          {patch.image ? (
                            <Image
                              value={patch.name}
                              src={patch.image}
                              role="button"
                              onClick={() => setModalShow(true)}
                              onClickCapture={(e) =>
                                setPatchImage(e.target.src)
                              }
                              className="card-img-top img-fluid"
                            />
                          ) : (
                            <Image
                              className="images-tissu-motifs"
                              src="../images/no-image.png"
                            />
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
              <ModalTissuPatch
                show={modalShow}
                image={patchImage}
                onHide={() => setModalShow(false)}
              />
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default TissuPage;
