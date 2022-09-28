import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { faPenToSquare, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Row, Table } from 'react-bootstrap';
import AdminMenu from '../../components/AdminMenu';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';
import TissuAdd from '../../components/TissuAdd';

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
export default function TissuListPage() {
  const navigate = useNavigate();

  const [{ loading, error, tissus, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/tissus`, {
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
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (tissu) => {
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/tissus/${tissu._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: 'DELETE_FAIL',
      });
    }
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Liste des tissus</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link8 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>

        <Col md={10} className="shadow p-5">
          <Row className="align-items-between">
            <Col md={4}>
              <h1>Tissus</h1>
            </Col>
            <Col md={8}>
              <TissuAdd />
            </Col>
          </Row>

          <hr />
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table responsive className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tissus.map((tissu) => (
                  <tr key={tissu._id}>
                    <td>{tissu.name}</td>

                    <td>
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(tissu)}
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
