import React, { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminMenu from '../../components/AdminMenu';

const reducer = (state, action) => {
  switch (action.type) {
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
export default function ProductAddPage() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingAdd, loadingUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
    }
  );

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/products/add`,
        {
          name,
          slug,
          price,
          weight,
          image,
          images,
          category,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Produit ajouté');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
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
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image téléversée');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image supprimée');
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Ajout d'un produit</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <AdminMenu link4 />
        </Col>
        <Col md={9} className="shadow p-5">
          <h1>Ajout d'un nouveau produit</h1>
          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="slug">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Prix</Form.Label>
                <Form.Control
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="weight">
                <Form.Label>Poids (grammes)</Form.Label>
                <Form.Control
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="imageFile">
                    <Form.Label>Image principale</Form.Label>
                    <Form.Control
                      className="mb-2"
                      type="file"
                      onChange={uploadFileHandler}
                    />
                    <div className="d-flex flex-column align-items-center">
                      {image ? (
                        <Image
                          thumbnail
                          src={image}
                          onChange={(e) => setImage(e.target.value)}
                          width="80"
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2" controlId="additionalImageFile">
                    <Form.Label>Ajouter des images</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => uploadFileHandler(e, true)}
                    />
                  </Form.Group>

                  <Form.Group controlId="additionalImage">
                    <div className="d-flex" variant="flush">
                      {images.map((x) => (
                        <div
                          key={x}
                          className="d-flex flex-column align-items-center mx-1"
                        >
                          <Image fluid thumbnail src={x} alt={x} />
                          <Button
                            variant="warning"
                            onClick={() => deleteFileHandler(x)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
                <Row> {loadingUpload && <LoadingBox></LoadingBox>}</Row>
              </Row>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Catégorie</Form.Label>
                <Form.Control
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="countInStock">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="mb-3">
                <Button disabled={loadingAdd} type="submit">
                  Ajouter
                </Button>
                {loadingAdd && <LoadingBox></LoadingBox>}
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
