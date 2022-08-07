import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Badge,
  Button,
  Image,
  Container,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Désolé, le produit est épuisé');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Entrez une note et un commentaire');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Commentaire soumis avec succès');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container className="my-5">
      <Row>
        <Col lg={1} md={1} sm={2} className="mt-2">
          <div className="d-flex flex-column">
            {[product.image, ...product.images].map((x) => (
              <Col key={x}>
                <Card>
                  <Button
                    className="img-thumbnail"
                    type="button"
                    variant="light"
                    onClick={() => setSelectedImage(x)}
                  >
                    <Card.Img src={x} alt="product" />
                  </Button>
                </Card>
              </Col>
            ))}
          </div>
        </Col>
        <Col md={5} lg={5} sm={1} className="mt-2">
          <Image
            src={selectedImage || product.image}
            fluid
            alt={product.name}
            className="img-large"
          />
        </Col>
        <Col md={6} className="mt-2">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              {product.countInStock > 0 ? (
                <Badge bg="success">{product.countInStock} En stock</Badge>
              ) : (
                <Badge bg="danger">Epuisé</Badge>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Prix : {product.price} &euro;</ListGroup.Item>
            <ListGroup.Item>
              <p>{product.description}</p>
            </ListGroup.Item>
            {product.countInStock > 0 && (
              <ListGroup.Item>
                <div className="d-grid">
                  <Button onClick={addToCartHandler} variant="primary">
                    Ajouter au panier
                  </Button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      <hr />
      <div className="my-3">
        <h2 ref={reviewsRef}>Avis</h2>
        <Row>
          <Col md="8">
            <Row>
              {product.reviews.map((review) => (
                <Col md={4}>
                  <Card key={review._id}>
                    <Card.Header>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption=" "></Rating>
                    </Card.Header>
                    <Card.Body>
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <ListGroup></ListGroup>
          </Col>
          <Col md={4}>
            <div className="mb-3">
              {product.reviews.length === 0 && (
                <MessageBox>Il n'y a pas encore d'avis</MessageBox>
              )}
            </div>

            <div className="my-3">
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <h2>Ajouter un avis</h2>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Note</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="1">1- Mauvais</option>
                      <option value="2">2- Moyen</option>
                      <option value="3">3- Bien</option>
                      <option value="4">4- Très bien</option>
                      <option value="5">5- Excellent</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="floatingTextarea">
                    <Form.Label>Commentaire</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Ecrivez votre commentaire ici"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>

                  <div className="mb-3">
                    <Button disabled={loadingCreateReview} type="submit">
                      Noter
                    </Button>
                    {loadingCreateReview && <LoadingBox></LoadingBox>}
                  </div>
                </form>
              ) : (
                <MessageBox>
                  <Link to={`/signin?redirect=/product/${product.slug}`}>
                    Connectez-vous
                  </Link>{' '}
                  pour rédiger un avis
                </MessageBox>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
export default ProductScreen;
