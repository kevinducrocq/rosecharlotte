import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Card,
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
import { logOutAndRedirect } from '../../../../backend/utils';
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
        chosenCategories: action.payload,
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
    {
      loading,
      loadingUpload,
      error,
      carouselHome,
      successDelete,
      successAdd,
      chosenCategories,
    },
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
          headers: { Authorization: `Bearer ${userInfo.token}` }.catch(
            function (error) {
              if (error.response && error.response.status === 401) {
                logOutAndRedirect();
              }
            }
          ),
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/settings/chosen-categories`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }.catch(
            function (error) {
              if (error.response && error.response.status === 401) {
                logOutAndRedirect();
              }
            }
          ),
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
                <Card className="p-4 mb-3">
                  <div className="my-3">
                    {carouselHome?.map((carousel) => {
                      return (
                        <Row key={carousel._id}>
                          <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
                            <div>
                              <span>Carousel de la page d'accueil</span>
                            </div>
                            <div>
                              <ModalEditCarouselHome
                                id={carousel._id}
                                onEditSuccess={() => setRefresh(true)}
                              />
                            </div>
                          </Card.Title>

                          <Col
                            className="d-flex flex-column align-items-center"
                            md={4}
                          >
                            <span className="text-muted mb-2">Slide n°1</span>
                            <Image src={carousel.firstImage} width="150px" />
                            <div className="mt-2">
                              <span>{carousel.firstText}</span>
                            </div>
                          </Col>

                          <Col
                            className="d-flex flex-column align-items-center"
                            md={4}
                          >
                            <span className="text-muted mb-2">Slide n°2</span>
                            <Image src={carousel.secondImage} width="150px" />
                            <div className="mt-2">
                              <span>{carousel.secondText}</span>
                            </div>
                          </Col>

                          <Col
                            className="d-flex flex-column align-items-center"
                            md={4}
                          >
                            <span className="text-muted mb-2">Slide n°3</span>
                            <Image src={carousel.thirdImage} width="150px" />
                            <div className="mt-2">
                              <span>{carousel.thirdText}</span>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </Card>
              </section>

              <section>
                <Card className="p-4">
                  <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                      <span>Catégorie mise en avant sur la page d'accueil</span>
                    </div>
                    <div>
                      <ModalCategoryHome />
                    </div>
                  </Card.Title>

                  {/* <div>
                    {chosenCategories.map((chosenCategory) => {
                      return <div>{chosenCategory._id}</div>;
                    })}
                  </div> */}
                </Card>
              </section>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
