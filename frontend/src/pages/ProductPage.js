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
  Breadcrumb,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { dateFr, getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import OwlCarousel from 'react-owl-carousel';

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

function ProductPage() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [customization, setCustomization] = useState('');
  const [variantId, setVariant] = useState('');

  const [fil, setFil] = useState('');
  const [tissu, setTissu] = useState('');
  const [patch, setPatch] = useState('');
  // const [buttonCartIsVisible, setButtonCartIsVisible] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });

  const options = {
    loop: false,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      600: {
        items: 2,
      },
      800: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  };

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
    const existItem = cart.cartItems.find(
      (x) =>
        x._id === product._id &&
        (x.variant === null || x.variant._id === variantId)
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (variantId) {
      const variantItem = data.variants.filter((v) => {
        return v._id === variantId;
      })[0];

      if (variantItem.countInStock < quantity) {
        window.alert(
          "Désolé, il n'y a plus de quantité disponible pour ce produit"
        );
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          ...product,
          quantity,
          variant: product.variants.filter((v) => {
            return v._id === variantId;
          })[0],
          customization,
          fil,
          tissu,
          patch,
        },
      });
    } else {
      if (data.countInStock < quantity) {
        window.alert('Désolé, le produit est épuisé');
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: {
          ...product,
          quantity,
          variant: null,
          customization,
          fil,
          tissu,
          patch,
        },
      });
    }
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
      <Breadcrumb>
        <LinkContainer to={'/'} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={'/boutique/search'}>
          <Breadcrumb.Item>Boutique</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/boutique/search?category=${product.category}`}>
          <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer
          to={`/boutique/search?subCategory=${product.subCategory}`}
        >
          <Breadcrumb.Item>{product.subCategory}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Row className="product-infos">
        <div>
          {userInfo && userInfo.isAdmin && (
            <Link to={`/admin/product/${product._id}`}>
              <Button>Editer</Button>
            </Link>
          )}
        </div>
        <Col md={2} className="product-vignettes">
          <div className="d-flex flex-column align-items-end">
            {[product.image, ...product.images].map((x) => (
              <Col key={x}>
                <div className="my-1">
                  <Button
                    variant="outline-none"
                    onClick={() => setSelectedImage(x)}
                  >
                    <Card.Img src={x} alt="product" className="img-thumbnail" />
                  </Button>
                </div>
              </Col>
            ))}
          </div>
        </Col>
        <Col md={4} className="mt-2">
          <div>
            <Image
              src={selectedImage || product.image}
              alt={product.name}
              fluid
              className="product-page-main-image"
            />
          </div>
        </Col>

        <div className="product-vignettes-bottom">
          {[product.image, ...product.images].map((x) => (
            <div key={x}>
              <Button
                variant="outline-none"
                onClick={() => setSelectedImage(x)}
              >
                <Card.Img src={x} alt="product" className="img-thumbnail" />
              </Button>
            </div>
          ))}
        </div>

        <Col md={6} className="mt-2">
          <ListGroup>
            <ListGroup.Item>
              <div className="d-flex flex-column justify-content-between p-2">
                <div>
                  <h1>{product.name}</h1>
                  <h2 className="h6 text-muted">
                    {product.category}
                    {product.subCategory ? ' - ' + product.subCategory : ''}
                    {/* {product.otherCategory ? ' - ' + product.otherCategory : ''} */}
                  </h2>
                </div>
                <div className="mt-3">
                  {product.variants.length >= 1 ? (
                    ''
                  ) : product.countInStock && product.countInStock > 0 ? (
                    <Badge bg="success">{product.countInStock} En stock</Badge>
                  ) : (
                    <Badge bg="danger">Epuisé</Badge>
                  )}
                </div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="p-2">
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></Rating>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="price-tag">
              <div className="p-2">{product.price} &euro;</div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="p-2">
                <p>{product.description}</p>
              </div>
            </ListGroup.Item>

            {product.variants.length >= 1 && (
              <>
                <ListGroup.Item>
                  <Form>
                    <Form.Label>Choisissez le modèle</Form.Label>
                    <Form.Select
                      className="mb-3"
                      onChange={(e) => {
                        setVariant(e.target.value);
                      }}
                    >
                      <option disabled>Choisissez...</option>
                      {product.variants.map((variant) => {
                        return (
                          <option key={variant._id} value={variant._id}>
                            {variant.name}&nbsp;
                            {variant.countInStock === 0
                              ? '- Non-disponible'
                              : ''}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form>
                </ListGroup.Item>
              </>
            )}

            {product.customizable && (
              <>
                <ListGroup.Item>
                  <Form>
                    <Form.Group className="my-3">
                      <Form.Label>Choisissez un type de fil</Form.Label>
                      <Form.Select
                        className="mb-3"
                        onChange={(e) => {
                          setFil(e.target.value);
                        }}
                      >
                        <option>Choisissez...</option>
                        {product.fils.map((fil) => {
                          return (
                            <option key={fil._id} value={fil.name}>
                              {fil.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Choisissez un type de tissu</Form.Label>
                      <Form.Select
                        className="mb-3"
                        onChange={(e) => {
                          setTissu(e.target.value);
                        }}
                      >
                        <option>Choisissez...</option>
                        {product.tissus.map((tissu) => {
                          return (
                            <option key={tissu._id} value={tissu.name}>
                              {tissu.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Choisissez un patch</Form.Label>
                      <Form.Select
                        onChange={(e) => {
                          setPatch(e.target.value);
                        }}
                      >
                        <option>Choisissez...</option>
                        {product.patches.map((patch) => {
                          return (
                            <option key={patch._id} value={patch.name}>
                              {patch.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="my-3">
                      <Form.Label>Texte à broder</Form.Label>
                      <Form.Control
                        value={customization}
                        placeholder="Charlotte, Rose..."
                        onChange={(e) => {
                          setCustomization(e.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Form>
                </ListGroup.Item>
              </>
            )}

            {product.countInStock > 0 || product.variants.length ? (
              <div className="p-2">
                <Button
                  onClick={addToCartHandler}
                  className="bg1 w-100"
                  variant="outline-light"
                >
                  Ajouter au panier
                </Button>
              </div>
            ) : (
              <ListGroup.Item>
                <div className="p-2">
                  <Button variant="secondary" disabled>
                    Epuisé
                  </Button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      <hr />

      <div className="my-3">
        <Row>
          <Col md={4} sm={2}>
            <div className="mb-3 p-4">
              <h2>Ajouter un avis</h2>

              {userInfo ? (
                <form onSubmit={submitHandler}>
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
                    <Button
                      disabled={loadingCreateReview}
                      type="submit"
                      variant="outline-light"
                      className="bg1 w-100"
                    >
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
          <Col md={8}>
            <Row>
              <div className="mb-3 p-4">
                <h2 ref={reviewsRef}>Avis des clients</h2>
                {product.reviews.length === 0 && (
                  <MessageBox bg2>
                    Il n'y a pas encore d'avis sur ce produit
                  </MessageBox>
                )}
              </div>
              <Row>
                {product.reviews.map((review) =>
                  !review.status === false ? (
                    <OwlCarousel
                      className="slider-items owl-carousel"
                      {...options}
                      id="slider_promos"
                    >
                      <Card>
                        <Card.Header>
                          <strong>{review.name}</strong>
                          <Rating rating={review.rating} caption=" "></Rating>
                        </Card.Header>
                        <Card.Body>
                          <p>{dateFr(review.createdAt)}</p>
                          <p>{review.comment}</p>
                        </Card.Body>
                      </Card>
                    </OwlCarousel>
                  ) : (
                    <MessageBox bg2>
                      Il n'y a pas encore d'avis sur ce produit
                    </MessageBox>
                  )
                )}
              </Row>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
export default ProductPage;
