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
import { Store } from '../../Store';
import { getError, logOutAndRedirect } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import AdminMenu from '../../components/AdminMenu';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';

import 'jquery/dist/jquery.min.js';
//Datatable Modules
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import ModalEditPatch from '../../components/ModalEditPatch';

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
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function PatchListPage() {
  const [
    { loading, loadingUpload, error, patches, successDelete, successAdd },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  $.DataTable = require('datatables.net');
  const tableRef = useRef();
  const [name, setName] = useState('');

  const imageInputRef = useRef();
  const [image, setImage] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios
          .get(`/api/patches`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
          .catch(function (error) {
            if (error.response && error.response.status === 401) {
              logOutAndRedirect();
            }
          });
        setTimeout(() => {
          const table = $(tableRef.current).DataTable({
            language: {
              url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json',
            },
            order: [[0, 'desc']],
            destroy: true,
          });
        }, 50);
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
    } else if (successAdd) {
      dispatch({ type: 'ADD_RESET' });
    } else {
      fetchData();
      if (refresh) {
        setRefresh(false);
      }
    }
  }, [userInfo, successDelete, successAdd, refresh]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'ADD_REQUEST' });
      await axios
        .post(
          `/api/patches/add`,
          {
            name,
            image,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        )
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            logOutAndRedirect();
          }
        });
      dispatch({ type: 'ADD_SUCCESS' });
      setName('');
      if (imageInputRef) imageInputRef.current.value = null;
      toast.success('Motif Broderie ajouté');
    } catch (err) {
      dispatch({ type: 'ADD_FAIL' });
      toast.error(getError(err));
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios
        .post('/api/upload/image', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            logOutAndRedirect();
          }
        });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.path);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteHandler = async (patch) => {
    if (window.confirm('Confirmer ?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios
          .delete(`/api/patches/${patch._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
          .catch(function (error) {
            if (error.response && error.response.status === 401) {
              logOutAndRedirect();
            }
          });

        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Liste des Motifs broderie</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link9 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>

        <Col md={10} className="shadow p-5">
          <h1>Motifs Broderie</h1>
          <Form onSubmit={submitHandler}>
            <Row className="align-items-center">
              <Col md={5} className="mt-2">
                <Form.Group controlId="name">
                  <Form.Control
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5} className="mt-2">
                <Form.Group controlId="imageFile">
                  <Form.Control
                    type="file"
                    ref={imageInputRef}
                    onChange={uploadFileHandler}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mt-2">
                {loadingUpload ? (
                  <LoadingBox />
                ) : (
                  <Button disabled={!name} type="submit" className="w-100">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                )}
              </Col>
            </Row>
          </Form>

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
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patches.map((patch) => (
                  <tr key={patch._id}>
                    <td>{patch.name}</td>
                    <td>
                      {patch.image && (
                        <Image thumbnail src={patch.image}></Image>
                      )}
                    </td>

                    <td>
                      <ModalEditPatch
                        id={patch._id}
                        onEditSuccess={() => setRefresh(true)}
                      />
                      <Button
                        className="btn btn-sm"
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(patch)}
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
