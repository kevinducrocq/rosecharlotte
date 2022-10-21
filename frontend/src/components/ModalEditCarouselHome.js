import React, { useReducer } from 'react';

import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Col, Form, Image, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getError } from '../utils';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import LoadingBox from './LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, successUpdate: false };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, successUpdate: false };
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

function ModalEditCarouselHome({ id, onEditSuccess }) {
  const carouselId = id;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, loadingUpload, loadingUpdate, successUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
    });

  const [firstImage, setFirstImage] = useState('');
  const [firstText, setFirstText] = useState('');
  const [secondImage, setSecondImage] = useState('');
  const [secondText, setSecondText] = useState('');
  const [thirdImage, setThirdImage] = useState('');
  const [thirdText, setThirdText] = useState('');
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (modalShow) {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/settings/${carouselId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setFirstImage(data.firstImage);
          setSecondImage(data.secondImage);
          setThirdImage(data.thirdImage);
          setFirstText(data.firstText);
          setSecondText(data.secondText);
          setThirdText(data.thirdText);
          dispatch({ type: 'FETCH_SUCCESS' });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        }
      };
      fetchData();
    }
  }, [modalShow, successUpdate, carouselId, userInfo.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/settings/${carouselId}`,
        {
          _id: id,
          firstImage,
          secondImage,
          thirdImage,
          firstText,
          secondText,
          thirdText,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      onEditSuccess();
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Carousel mis à jour avec succès');
      setModalShow(false);
      if (successUpdate) {
        dispatch({ type: 'UPDATE_RESET' });
      }
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandlerOne = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload/image', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (firstImage) {
        setFirstImage(data.path);
      }

      dispatch({ type: 'UPLOAD_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const uploadFileHandlerTwo = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload/image', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (secondImage) {
        setSecondImage(data.path);
      }

      dispatch({ type: 'UPLOAD_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const uploadFileHandlerThree = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload/image', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (thirdImage) {
        setThirdImage(data.path);
      }
      dispatch({ type: 'UPLOAD_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  return (
    <>
      <Button
        className="btn btn-sm me-1"
        type="button"
        variant="light"
        onClick={() => setModalShow(true)}
      >
        <FontAwesomeIcon icon={faPen} />
      </Button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {loading ? (
          <LoadingBox />
        ) : (
          <Form onSubmit={submitHandler}>
            <Modal.Body className="my-4 p-4">
              <Row className="align-items-center">
                <Col>
                  <Form.Group controlId="firstImage">
                    <Form.Control
                      className="mb-2"
                      type="file"
                      onChange={uploadFileHandlerOne}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="firstText">
                    <Form.Control
                      placeholder="Texte de l'image 1"
                      value={firstText}
                      onChange={(e) => setFirstText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {firstImage ? (
                    <Image
                      thumbnail
                      src={firstImage}
                      onChange={(e) => setFirstImage(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>

              <Row className="align-items-center">
                <Col>
                  <Form.Group controlId="secondImage">
                    <Form.Control
                      className="mb-2"
                      type="file"
                      onChange={uploadFileHandlerTwo}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="secondText">
                    <Form.Control
                      placeholder="Texte de l'image 2"
                      value={secondText}
                      onChange={(e) => setSecondText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {secondImage ? (
                    <Image
                      thumbnail
                      src={secondImage}
                      onChange={(e) => setSecondImage(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col>
                  <Form.Group controlId="thirdImage">
                    <Form.Control
                      className="mb-2"
                      type="file"
                      onChange={uploadFileHandlerThree}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="thirdText">
                    <Form.Control
                      placeholder="Texte de l'image 3"
                      value={thirdText}
                      onChange={(e) => setThirdText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {thirdImage ? (
                    <Image
                      thumbnail
                      src={thirdImage}
                      onChange={(e) => setThirdImage(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              {loadingUpdate ? (
                <LoadingBox />
              ) : (
                <Button
                  disabled={loadingUpload}
                  type="submit"
                  className="bg1 w-100"
                  variant="outline-light"
                >
                  Mettre à jour
                </Button>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </>
  );
}

export default ModalEditCarouselHome;
