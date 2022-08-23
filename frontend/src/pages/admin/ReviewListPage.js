import { faCheck, faEyeSlash, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import AdminMenu from '../../components/AdminMenu';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../utils';

import 'jquery/dist/jquery.min.js';
//Datatable Modules
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';

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

    case 'VALIDATE_REQUEST':
      return { ...state, loadingValidate: true };
    case 'VALIDATE_SUCCESS':
      return { ...state, loadingValidate: false, successValidate: true };
    case 'VALIDATE_FAIL':
      return { ...state, loadingValidate: false };
    case 'VALIDATE_RESET':
      return {
        ...state,
        loadingValidate: false,
        successValidate: false,
      };
    case 'HIDE_REQUEST':
      return { ...state, loadingHide: true };
    case 'HIDE_SUCCESS':
      return { ...state, loadingHide: false, successHide: true };
    case 'HIDE_FAIL':
      return { ...state, loadingHide: false };
    case 'HIDE_RESET':
      return {
        ...state,
        loadingHide: false,
        successHide: false,
      };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ReviewListPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, reviews, successValidate, successHide, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    successDelete: false,
    successHide: false,
    successValidate: false,
    loadingDelete: false,
    loadingValidate: false,
    loadingHide: false,
    loading: true,
    error: '',
  });

  $.DataTable = require('datatables.net');
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/reviews`, {
          baseURL: 'http://localhost:9123', headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const table = $(tableRef.current).DataTable({
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json',
          },
          order: [[2, 'desc']],
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
    if (successValidate) {
      dispatch({ type: 'VALIDATE_RESET' });
    }
    if (successHide) {
      dispatch({ type: 'HIDE_RESET' });
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    }
  }, [successDelete, successHide, successValidate, userInfo]);

  const validateHandler = async (review) => {
    try {
      dispatch({ type: 'VALIDATE_REQUEST' });
      await axios.put(
        `/api/products/${review.product._id}/review/${review._id}`,
        [],
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'VALIDATE_SUCCESS' });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: 'VALIDATE_FAIL',
      });
    }
  };

  const hideHandler = async (review) => {
    try {
      dispatch({ type: 'HIDE_REQUEST' });
      await axios.put(
        `/api/products/${review.product._id}/review/${review._id}/hide`,
        [],
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'HIDE_SUCCESS' });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: 'HIDE_FAIL',
      });
    }
  };

  const deleteHandler = async (review) => {
    if (window.confirm('Supprimer le commentaire?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(
          `/api/products/${review.product._id}/review/${review._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  console.log(reviews);
  return (
    <Container className="my-5">
      <Helmet>
        <title>Commentaires</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link6 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>
        <Col md={10} className="shadow p-5">
          <h1>Commentaires</h1>
          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table
              ref={tableRef}
              responsive
              className="table table-striped table-responsive"
            >
              <thead>
                <tr>
                  <th>Auteur</th>
                  <th>Commentaire</th>
                  <th>Produit</th>
                  <th>Note</th>
                  <th>Crée le</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.name}</td>
                    <td>{review.comment}</td>
                    <td>{review.product.name}</td>
                    <td>{review.rating}</td>
                    <td>{review.createdAt.substring(0, 10)}</td>
                    <td>
                      <div
                        className={
                          review.status === false
                            ? 'bg-danger badge rounded text-white'
                            : 'bg-success badge rounded text-white'
                        }
                      >
                        {review.status === false ? 'A valider' : 'Publié'}
                      </div>
                    </td>
                    <td>
                      {review.status === false ? (
                        <Button
                          className="btn btn-sm"
                          type="button"
                          variant="success"
                          onClick={() => validateHandler(review)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </Button>
                      ) : (
                        <Button
                          className="btn btn-sm"
                          type="button"
                          variant="light"
                          onClick={() => hideHandler(review)}
                        >
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </Button>
                      )}
                      &nbsp;
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(review)}
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
