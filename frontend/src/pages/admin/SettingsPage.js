import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  NavDropdown,
  Row,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';
import AdminMenu from '../../components/AdminMenu';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import ModalCategoryHome from '../../components/ModalCategoryHome';
import ModalEditCarouselHome from '../../components/ModalEditCarouselHome';
import { Store } from '../../Store';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        carouselHome: action.payload,
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

export default function SettingsPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, loadingUpload, error, carouselHome, successDelete, successAdd },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/settings/`, {
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
    } else if (successAdd) {
      dispatch({ type: 'ADD_RESET' });
    } else {
      fetchData();
      if (refresh) {
        setRefresh(false);
      }
    }
  }, [userInfo, successDelete, successAdd, refresh]);

  return (
    <Container className="my-5">
      <Helmet>
        <title>Paramètres</title>
      </Helmet>

      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link10 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>
        <Col md={10} className="shadow p-5">
          <h1>Paramètres du site</h1>
          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <section>
                <h2 className="h4">Page d'acceuil</h2>

                <div className="my-3">
                  <h3>Carousel</h3>
                  {carouselHome?.map((carousel) => {
                    return (
                      <div key={carousel._id}>
                        <div className="d-flex">
                          <div className="d-flex align-items-center">
                            <div>
                              <Image src={carousel.firstImage} thumbnail />
                            </div>
                            <div> {carousel.firstText}</div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div>
                              <Image src={carousel.secondImage} thumbnail />
                            </div>
                            <div> {carousel.secondText}</div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div>
                              <Image src={carousel.thirdImage} thumbnail />
                            </div>
                            <div> {carousel.thirdText}</div>
                          </div>
                        </div>
                        <div>
                          <ModalEditCarouselHome
                            id={carousel._id}
                            onEditSuccess={() => setRefresh(true)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="my-3">
                  <h3>Catégorie mise en avant (page d'accueil)</h3>
                  <div>
                    <ModalCategoryHome />
                  </div>
                </div>

                <div>
                  <div>Message</div>
                </div>
              </section>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
