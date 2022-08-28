import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Container,
  Button,
  Form,
  Image,
  Row,
  Col,
  InputGroup,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEuroSign,
  faMinus,
  faPlus,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import AdminMenu from '../../components/AdminMenu';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
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
export default function ProductEditPage() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryInputIsVisible, setCategoryInputIsVisible] = useState(false);
  const [subCategoryInputIsVisible, setSubCategoryInputIsVisible] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setWeight(data.weight);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setSubCategory(data.subCategory);
        setOtherCategory(data.otherCategory);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [productId]);

  const renderedCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedCategories.push(
      <option
        selected={productId.category}
        key={category}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {category}
      </option>
    );
  });

  const renderedSubCategories = [];
  Object.keys(categories).forEach(function (category) {
    renderedSubCategories.push(
      <>
        {categories[category].map((key) => {
          return (
            <option value={key} key={key} selected={key}>
              {key}
            </option>
          );
        })}
      </>
    );
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          weight,
          image,
          images,
          category,
          subCategory,
          otherCategory,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Produit mis à jour avec succès');
      navigate('/admin/products');
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
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
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
    toast.success(
      'Image supprimée, cliquer sur "mettre à jour" pour appliquer les changements'
    );
  };
  return (
    <Container className="my-5">
      <Helmet>
        <title>Edition du produit {productId}</title>
      </Helmet>
      <Row>
        <Col md={2}>
          <AdminMenu />
        </Col>
        <Col md={10} className="shadow p-5">
          <div className="mb-3">
            <h1>Edition du produit</h1>
            <small className="text-muted">{productId}</small>
          </div>

          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={3} sm={6}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3} sm={6}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Prix</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEuroSign} />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="weight">
                    <Form.Label>Poids</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                      <InputGroup.Text>grammes</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="countInStock">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
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
              <hr />
              <Row>
                <>
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="category">
                      <Form.Label>Séléctionner une catégorie &nbsp;</Form.Label>
                      <Form.Select
                        aria-label="category select"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="1">Choisissez...</option>
                        {renderedCategories}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Ajouter une catégorie ?</Form.Label>
                      <InputGroup size="sm" className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-sm">
                          <Button
                            variant="none"
                            className="btn btn-sm"
                            onClick={() =>
                              setCategoryInputIsVisible(!categoryInputIsVisible)
                            }
                          >
                            <FontAwesomeIcon
                              icon={categoryInputIsVisible ? faMinus : faPlus}
                            />
                          </Button>
                        </InputGroup.Text>
                        <Form.Control
                          className={categoryInputIsVisible ? '' : 'd-none'}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Nom"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </>
              </Row>
              <Row>
                <Col md={8}>
                  <Form.Label>Séléctionner une sous-catégorie</Form.Label>
                  <Form.Select
                    aria-label="category select"
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    <option>Choisissez...</option>
                    {renderedSubCategories}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Ajouter une sous-catégorie ?</Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        <Button
                          variant="none"
                          className="btn btn-sm"
                          onClick={() =>
                            setSubCategoryInputIsVisible(
                              !subCategoryInputIsVisible
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={subCategoryInputIsVisible ? faMinus : faPlus}
                          />
                        </Button>
                      </InputGroup.Text>
                      <Form.Control
                        className={subCategoryInputIsVisible ? '' : 'd-none'}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder="Nom"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="sousCategory">
                <Form.Label>Autre Catégorie ?</Form.Label>
                <Form.Control
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                />
              </Form.Group>
              <hr />
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
                <Button
                  disabled={loadingUpdate}
                  type="submit"
                  className="bg1 w-100"
                  variant="outline-light"
                >
                  Mettre à jour
                </Button>
                {loadingUpdate && <LoadingBox></LoadingBox>}
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
