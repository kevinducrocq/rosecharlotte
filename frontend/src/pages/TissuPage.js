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
        tissus: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function TissuPage() {
  const [{ loading, error, tissus }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/tissus/');
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
        <title>TissuThèque</title>
      </Helmet>

      <Container className="my-5">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <section className="mt-5">
              <h2>TissuThèque</h2>
              <Row className="mt-5">
                {tissus.map((tissu) => (
                  <Col key={tissu._id} md={4} sm={6} lg={2}>
                    <Card className="mb-3">
                      <Card.Header className="text-center">
                        {tissu.name}
                      </Card.Header>
                      <Card className="body">
                        {tissu.image ? (
                          <Image
                            src={tissu.image}
                            className="images-tissu-motifs"
                          />
                        ) : (
                          <Image
                            className="images-tissu-motifs"
                            src="../images/no-image.png"
                          />
                        )}
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

export default TissuPage;
