import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

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

function PatchPage() {
  const [{ loading, error, patches }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

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

  return (
    <>
      <Helmet>
        <title>MotifThèque</title>
      </Helmet>

      <Container className="my-5">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <section className="mt-5">
              <h2>MotifsThèque</h2>
              <Row className="mt-5">
                {patches.map((patch) => (
                  <Col key={patch._id} md={4} sm={6} lg={3}>
                    <Card className="mb-3">
                      <Card.Header>{patch.name}</Card.Header>
                      <Card className="body">
                        <Image src={patch.image} />
                      </Card>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default PatchPage;
