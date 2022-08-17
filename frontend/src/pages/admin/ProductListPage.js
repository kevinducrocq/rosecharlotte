import React, { useContext, useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Container, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import AdminMenu from '../../components/AdminMenu';

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
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'EDIT_REQUEST':
      return { ...state, loadingCreate: true };
    case 'EDIT_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'EDIT_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    { loading, error, products, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  $.DataTable = require('datatables.net');
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const table = $(tableRef.current).DataTable({
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json',
          },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data, table });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (product) => {
    if (window.confirm('Confirmer ?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Produit supprimé');
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
      <Row>
        <Col md={2}>
          <AdminMenu link3 />
        </Col>
        <Col md={10} className="shadow p-5">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Produits</h1>
            <div>
              <Link to="/admin/product/add" className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} /> Ajouter
              </Link>
            </div>
          </div>
          <hr />

          {loadingCreate && <LoadingBox></LoadingBox>}
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Table ref={tableRef} responsive className="table table-striped">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Sous-catégorie</th>
                    <th>Prix</th>
                    <th>Poids</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.subCategory}</td>
                      <td>{product.price} &euro;</td>
                      <td>{product.weight} g</td>
                      <td>
                        <Button
                          className="btn btn-sm"
                          type="button"
                          variant="light"
                          onClick={() =>
                            navigate(`/admin/product/${product._id}`)
                          }
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                        &nbsp;
                        <Button
                          className="btn btn-sm"
                          type="button"
                          variant="danger"
                          onClick={() => deleteHandler(product)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
