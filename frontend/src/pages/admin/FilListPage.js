import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import AdminMenu from '../../components/AdminMenu';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';

import 'jquery/dist/jquery.min.js';
//Datatable Modules
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        fils: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_REQUEST':
      return { ...state, loading: true, successAdd: false };
    case 'ADD_SUCCESS':
      return { ...state, loading: false, successAdd: true };
    case 'ADD_FAIL':
      return { ...state, loading: false };
    case 'ADD_RESET':
      return { ...state, loading: false, successAdd: false };
    case 'DELETE_REQUEST':
      return { ...state, loading: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loading: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loading: false };
    case 'DELETE_RESET':
      return { ...state, loading: false, successDelete: false };
    default:
      return state;
  }
};
export default function TissuListPage() {
  const navigate = useNavigate();

  const [{ loading, error, fils, successDelete, successAdd }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  $.DataTable = require('datatables.net');
  const tableRef = useRef();

  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/fils`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setTimeout(() => {
          const table = $(tableRef.current).DataTable({
            language: {
              url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json',
            },
            order: [[0, 'desc']],
          });
        }, 500);
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
    }
    if (successAdd) {
      dispatch({ type: 'ADD_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, successAdd]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'ADD_REQUEST' });
      await axios.post(
        `/api/fils/add`,
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'ADD_SUCCESS' });
      setName('');
      toast.success('Fil ajouté');
      navigate('/admin/fils');
    } catch (err) {
      dispatch({ type: 'ADD_FAIL' });
      toast.error(getError(err));
    }
  };

  const deleteHandler = async (fil) => {
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/fils/${fil._id}`, {
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
        <title>Liste des fils</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link7 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>

        <Col md={10} className="shadow p-5">
          <Row className="align-items-between">
            <Col md={4}>
              <h1>Fils</h1>
            </Col>
            <Col md={8}>
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={8}>
                    <Form.Group controlId="name">
                      <Form.Control
                        placeholder="Nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <Button type="submit">Ajouter</Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table ref={tableRef} responsive className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fils.map((fil) => (
                  <tr key={fil._id}>
                    <td>{fil.name}</td>

                    <td>
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(fil)}
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
