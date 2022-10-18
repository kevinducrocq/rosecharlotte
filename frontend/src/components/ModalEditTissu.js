import React, { useReducer } from 'react';

import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Form, Image } from 'react-bootstrap';
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

function ModalTissuEdit({ id, onEditSuccess }) {
  const tissuId = id;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, loadingUpload, loadingUpdate, successUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
    });

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (modalShow) {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/tissus/${tissuId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setName(data.name);
          setImage(data.image);
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
  }, [modalShow, successUpdate, tissuId, userInfo.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/tissus/${tissuId}`,
        {
          _id: id,
          name,
          image,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      onEditSuccess();
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Tissu mis à jour avec succès');
      setModalShow(false);
      if (successUpdate) {
        dispatch({ type: 'UPDATE_RESET' });
      }
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data.secure_url);
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
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {loading ? (
          <LoadingBox />
        ) : (
          <Form onSubmit={submitHandler}>
            <Modal.Body className="my-4 p-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Control
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="imageFile">
                <Form.Control
                  className="mb-2"
                  type="file"
                  onChange={uploadFileHandler}
                />
                {loadingUpload ? (
                  <LoadingBox />
                ) : (
                  <>
                    {image ? (
                      <div className="my-3">
                        <Image
                          thumbnail
                          src={image}
                          onChange={(e) => setImage(e.target.value)}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </Form.Group>
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

export default ModalTissuEdit;
