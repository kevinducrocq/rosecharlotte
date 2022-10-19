import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
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
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <section className="mt-5">
              <h2>Motifs Broderie</h2>
              <Row className="mt-5">
                {patches.map((patch) => (
                  <Col key={patch._id} md={4} sm={6} lg={3}>
                    <Card className="mb-3">
                      <Card.Header className="text-center">
                        <h4>{patch.name}</h4>
                      </Card.Header>
                      <div className="text-center">
                        {patch.image ? (
                          <Image
                            value={patch.name}
                            src={patch.image}
                            role="button"
                            onClick={() => setModalShow(true)}
                            onClickCapture={(e) => setPatchImage(e.target.src)}
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
