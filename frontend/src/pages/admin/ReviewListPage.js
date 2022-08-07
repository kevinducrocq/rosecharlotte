import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import AdminMenu from '../../components/AdminMenu';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        reviews: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ReviewListPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, reviews }, dispatch] = useReducer(reducer, {
    successValidate: false,
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/reviews`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container className="my-5">
      <Helmet>
        <title>Commentaires</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <AdminMenu link6 />
        </Col>
        <Col md={10} className="shadow p-5">
          <h1>Commentaires</h1>
          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table responsive className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th>Auteur</th>
                  <th>Produit</th>
                  <th>Note</th>
                  <th>Commentaire</th>
                  <th>Crée le</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.name}</td>
                    <td>{review.product.name}</td>
                    <td>{review.rating}</td>
                    <td>{review.comment}</td>
                    <td>{review.createdAt.substring(0, 10)}</td>
                    <td
                      className={
                        review.status === false
                          ? 'bg-danger rounded text-white'
                          : 'bg-success rounded text-white'
                      }
                    >
                      {review.status === false ? 'A valider' : 'publié'}
                    </td>
                    <td>
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="success"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </Button>
                      &nbsp;
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="danger"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}
