import React, { useContext, useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Container,
  Table,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError, logOutAndRedirect } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faMoon,
  faPenToSquare,
  faPlus,
  faSun,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import AdminMenu from '../../components/AdminMenu';

import 'jquery/dist/jquery.min.js';
//Datatable Modules
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { Helmet } from 'react-helmet-async';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';

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
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      loadingCreate,
      loadingDelete,
      successDelete,
      successHide,
      successValidate,
    },
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

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios
          .get(`/api/products/admin?page=${page} `, {
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
            order: [[5, 'desc']],
            destroy: true,
            pageLength: 25,
          });
        }, 500);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();

    if (successValidate) {
      dispatch({ type: 'VALIDATE_RESET' });
      toast.success('Votre produit a été remis en vente');
    }
    if (successHide) {
      dispatch({ type: 'HIDE_RESET' });
      toast.success('Votre produit a été caché de la vente');
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    }
  }, [page, userInfo, successDelete, successValidate, successHide]);

  const validateHandler = async (product) => {
    try {
      dispatch({ type: 'VALIDATE_REQUEST' });
      await axios
        .put(`/api/products/${product._id}/validate`, [], {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            logOutAndRedirect();
          }
        });
      dispatch({ type: 'VALIDATE_SUCCESS' });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: 'VALIDATE_FAIL',
      });
    }
  };

  const hideHandler = async (product) => {
    try {
      dispatch({ type: 'HIDE_REQUEST' });
      await axios
        .put(`/api/products/${product._id}/hide`, [], {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            logOutAndRedirect();
          }
        });
      dispatch({ type: 'HIDE_SUCCESS' });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: 'HIDE_FAIL',
      });
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Confirmer ?')) {
      try {
        await axios
          .delete(`/api/products/${product._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
          .catch(function (error) {
            if (error.response && error.response.status === 401) {
              logOutAndRedirect();
            }
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
      <Helmet>
        <title>Produits</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link3 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
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
                    <th>Stock</th>
                    <th>Prix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockPopover = (
                      <Popover
                        id="popover-basic"
                        placement="top"
                        title={product.name}
                        key={product._id}
                        className="p-2"
                      >
                        {product.variants.map((variant) => {
                          return (
                            <div key={variant._id}>
                              <strong>Variante : </strong> {variant.name} -{' '}
                              <strong>Stock : </strong>
                              {variant.countInStock}
                            </div>
                          );
                        })}
                      </Popover>
                    );
                    return (
                      <tr key={product._id}>
                        <td>
                          <Link
                            to={`/product/${product.slug}`}
                            className="admin-product-link"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.subCategory}</td>

                        {product.variants.length ? (
                          <td>
                            <OverlayTrigger
                              trigger="click"
                              placement="top"
                              overlay={stockPopover}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                style={{ cursor: 'pointer' }}
                              />
                            </OverlayTrigger>
                          </td>
                        ) : (
                          <td>{product.countInStock}</td>
                        )}

                        <td>{product.price} &euro;</td>
                        <td className="text-nowrap">
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
                          &nbsp;
                          {product.isVisible === false ? (
                            <Button
                              className="btn btn-sm bg-dark"
                              type="button"
                              onClick={() => validateHandler(product)}
                            >
                              <FontAwesomeIcon icon={faMoon} />
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-sm"
                              type="button"
                              variant="primary"
                              onClick={() => hideHandler(product)}
                            >
                              <FontAwesomeIcon icon={faSun} color={'yellow'} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
