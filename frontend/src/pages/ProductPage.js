import axios from "axios";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button,
  Container,
  Breadcrumb,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { dateFr, getError, logOutAndRedirect } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import nl2br from "react-nl2br";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faCircleChevronLeft,
  faCircleChevronRight,
  faMagnifyingGlassPlus,
} from "@fortawesome/pro-solid-svg-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SlickCarousel from "../components/SlickCarousel";
import ModalTissuPatch from "../components/ModalZoomImage";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductPage() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [customization, setCustomization] = useState("");
  const [variantId, setVariant] = useState("");
  const [side, setSide] = useState("");

  const [fil, setFil] = useState("");
  const [tissu, setTissu] = useState("");
  const [patch, setPatch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [readMore, setReadMore] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [tissuImage, setTissuImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  // Récupère le produit de la BDD

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        let readMore = [];
        result.data.reviews.forEach((review) => {
          readMore[review._id] = false;
        });
        setReadMore(readMore);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    setRefresh((r) => r + 1);
  }, [tissu, patch]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Fonction d'ajout au panier
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(
      (x) =>
        x._id === product._id &&
        (x.variant === null || x.variant._id === variantId) &&
        (x.side === null || x.side === side) &&
        (x.customizable === false ||
          (x.customization === customization &&
            x.fil === fil &&
            x.tissu === tissu &&
            x.patch === patch))
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
        type: "CART_ADD_ITEM",
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
          side,
        },
      });
    } else {
      if (data.countInStock < quantity) {
        window.alert("Désolé, le produit est épuisé");
        return;
      }
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: {
          ...product,
          quantity,
          variant: null,
          customization,
          fil,
          tissu,
          patch,
          side,
        },
      });
    }
    navigate("/cart");
  };

  // Fonction pour ajouter un commentaire
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Entrez une note et un commentaire");
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

      // .catch(function (error) {
      //   if (error.response && error.response.status === 401) {
      //     logOutAndRedirect();
      //   }
      // });

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Commentaire soumis avec succès");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  // Le produit est-il une barrette ?
  const isBarrette = () => {
    return product.name.includes(
      "Barrette",
      "Barrettes",
      "barrette",
      "barrettes",
      "barette",
      "Barette"
    );
  };

  const isFil = () => {
    return product.fils && product.fils.length > 0;
  };
  const isTissu = () => {
    return product.tissus && product.tissus.length > 0;
  };
  const isPatch = () => {
    return product.patches && product.patches.length > 0;
  };

  // Card commentaire
  const renderReview = () => {
    return product.reviews.map(
      (review) =>
        review.status === true && (
          <div>
            <Card key={review._id} id={review._id} className="mx-2">
              <Card.Header>
                <strong>{review.name}</strong>
                <Rating rating={review.rating} caption=" "></Rating>
              </Card.Header>
              <Card.Body>
                <p>{dateFr(review.createdAt)}</p>
                <small>
                  {readMore[review._id]
                    ? nl2br(review.comment)
                    : review.comment.substring(0, 80)}
                  ...
                  {review.comment.length > 80 && (
                    <button
                      className="btn"
                      onClick={() => {
                        readMore[review._id] = !readMore[review._id];
                        setReadMore({ ...readMore });
                      }}
                    >
                      {readMore[review._id] ? "lire moins" : "lire plus"}
                    </button>
                  )}
                </small>
              </Card.Body>
            </Card>
          </div>
        )
    );
  };

  // Carousel avec les avis des clients
  const renderCarouselReviews = () => {
    if (product.reviews.length >= 3) {
      return (
        <SlickCarousel
          {...{
            dots: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            speed: 500,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                },
              },
              {
                breakpoint: 990,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ],
          }}
        >
          {renderReview()}
        </SlickCarousel>
      );
    } else if (product.reviews.length < 3) {
      return (
        <Row>
          <Col md={4}>{renderReview()}</Col>
        </Row>
      );
    }
  };

  // Formulaires des variantes du produit
  const renderVariationsForm = () => {
    return (
      <div className="mb-3">
        <Form className="p-2">
          <div className="h5">
            <span>Choisissez le modèle</span>
          </div>
          <Form.Select
            className=""
            onChange={(e) => {
              setVariant(e.target.value);
            }}
          >
            <option disabled selected={!variantId} value="">
              Choisissez...
            </option>
            {product.variants.map((variant) => {
              return (
                <option key={variant._id} value={variant._id}>
                  {variant.name}&nbsp;
                  {variant.promoPrice > 0 &&
                    "- Ancien prix : " +
                      variant.price +
                      " €" +
                      " || Nouveau : " +
                      variant.promoPrice +
                      " €"}
                  {variant.soldePrice > 0 &&
                    "- Ancien prix : " +
                      variant.price +
                      " €" +
                      " || Nouveau : " +
                      variant.soldePrice +
                      " €"}
                  {variant.price > 0 &&
                    variant.promoPrice === null &&
                    variant.soldePrice === null &&
                    " - " + variant.price + " €"}
                  {variant.countInStock <= 0 ? " - Non disponible" : ""}
                </option>
              );
            })}
          </Form.Select>
        </Form>
      </div>
    );
  };

  // Formulaire des fils du produit
  const renderFilsForm = () => {
    return (
      <>
        <Form.Group className="mb-3">
          <div className="h5">
            <span>Choisissez le Fil</span>
          </div>
          <Form.Select
            className="mb-3"
            onChange={(e) => {
              setFil(e.target.value);
            }}
          >
            <option disabled selected={!fil}>
              Choisissez...
            </option>
            {product.fils.map((fil) => {
              return (
                <option key={fil._id} value={fil.name}>
                  {fil.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </>
    );
  };

  // Formulaire des tissus du produit
  const renderTissusForm = () => {
    return (
      <>
        <div className="h5 mb-3">
          <span>Choisissez le tissu</span>
        </div>

        <SlickCarousel
          {...{
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 5,
                },
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                },
              },
            ],
          }}
        >
          {product.tissus.map((currentTissu) => {
            return (
              <div key={currentTissu._id}>
                <div
                  role="button"
                  className={tissu === currentTissu.name ? "selected-item" : ""}
                  onClick={() => {
                    setTissu(currentTissu.name);
                  }}
                >
                  <div className="d-flex flex-column align-items-center">
                    {currentTissu.image ? (
                      <>
                        <LazyLoadImage
                          className="product-carousel-image"
                          alt={currentTissu.name}
                          src={currentTissu.image}
                          placeholderSrc="../Spinner.svg"
                        />

                        <FontAwesomeIcon
                          role="button"
                          icon={faMagnifyingGlassPlus}
                          className="btn-zoom"
                          onClick={() => {
                            setTissuImage(currentTissu.image);
                            setModalShow(true);
                          }}
                        />
                      </>
                    ) : (
                      <LazyLoadImage
                        className="product-carousel-image"
                        alt={currentTissu.name}
                        src="../images/no-image.png"
                        placeholderSrc="../Spinner.svg"
                      />
                    )}
                    <p className="caption-carousel">{currentTissu.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </SlickCarousel>
        {tissu && (
          <div className="text-muted">
            Vous avez choisi : &nbsp;
            <strong className="bg1 badge badge-pill">{tissu}</strong>
          </div>
        )}
        <ModalTissuPatch
          show={modalShow}
          image={tissuImage}
          onHide={() => setModalShow(false)}
        />
      </>
    );
  };

  // Formulaire des motifs broderie du produit
  const renderPatchesForm = () => {
    return (
      <>
        <hr />
        <div className="h5 mb-3">
          <span>Choisissez le motif à broder</span>
        </div>
        <SlickCarousel
          {...{
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 5,
                },
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                },
              },
            ],
          }}
        >
          {product.patches.map((currentPatch) => {
            return (
              <div className="item" key={currentPatch._id}>
                <div
                  role="button"
                  className={
                    patch === currentPatch.name ? "selected-item p-1" : "p-1"
                  }
                  onClick={() => {
                    setPatch(currentPatch.name);
                  }}
                >
                  <div className="d-flex flex-column align-items-center">
                    {currentPatch.image ? (
                      <>
                        <LazyLoadImage
                          className="product-carousel-image"
                          alt={currentPatch.name}
                          src={currentPatch.image}
                          placeholderSrc="../Spinner.svg"
                        />
                        <FontAwesomeIcon
                          role="button"
                          icon={faMagnifyingGlassPlus}
                          className="btn-zoom"
                          onClick={() => {
                            setTissuImage(currentPatch.image);
                            setModalShow(true);
                          }}
                        />
                      </>
                    ) : (
                      <LazyLoadImage
                        className="product-carousel-image"
                        alt={currentPatch.name}
                        src="../images/no-image.png"
                        placeholderSrc="../Spinner.svg"
                      />
                    )}
                    <p className="caption-carousel">{currentPatch.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </SlickCarousel>
        {patch && (
          <div className="text-muted">
            Vous avez choisi : &nbsp;
            <b className="bg1 badge badge-pill">{patch}</b>
          </div>
        )}
      </>
    );
  };

  const renderCommentaireForm = () => {
    return (
      <>
        <hr />
        <Form.Group className="my-3">
          <div className="h5">
            <span>Commentaire (facultatif)</span>
          </div>
          <Form.Control
            value={customization}
            placeholder="Commentaire, texte personnalisé à broder..."
            onChange={(e) => {
              setCustomization(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
      </>
    );
  };

  const renderPersonalizationFormElements = () => {
    const renderedFormsBis = [];

    if (isFil()) {
      renderedFormsBis.push(renderFilsForm());
    }

    if (isFil() && !fil) {
      return renderedFormsBis;
    }

    if (isTissu()) {
      renderedFormsBis.push(renderTissusForm());
    }

    if (isTissu() && !tissu) {
      return renderedFormsBis;
    }

    if (isPatch()) {
      renderedFormsBis.push(renderPatchesForm());
    }

    if (isPatch() && !patch) {
      return renderedFormsBis;
    }

    renderedFormsBis.push(renderCommentaireForm());
    return renderedFormsBis;
  };

  const renderPersonalisationForms = () => {
    return (
      <div>
        <Form>{renderPersonalizationFormElements()}</Form>
      </div>
    );
  };

  const renderVariationsAndPersonalisationForm = () => {
    const renderedForms = [];

    if (product.variants.length > 0) {
      renderedForms.push(renderVariationsForm());
    }

    if (
      (product.variants.length === 0 ||
        (product.variants.length > 0 && variantId)) &&
      product.customizable
    ) {
      renderedForms.push(renderPersonalisationForms());
    }
    return renderedForms;
  };

  const isAddToCartButtonActive = () => {
    if (product.customizable) {
      if (isPatch()) {
        return !!patch;
      }
      if (isTissu()) {
        return !!tissu;
      }
      if (isFil()) {
        return !!fil;
      }
    } else if (product.variants.length > 0) {
      return !!variantId;
    } else if (isBarrette()) {
      return !!side;
    }
    return true;
  };

  const renderAddToCartButton = () => {
    let btnDisabled = !isAddToCartButtonActive();

    return (
      <Button
        disabled={btnDisabled}
        onClick={addToCartHandler}
        className={
          btnDisabled
            ? "bg-light text-secondary border-light w-100"
            : "bg1 w-100"
        }
        variant={btnDisabled ? "" : "outline-light"}
      >
        Ajouter au panier
      </Button>
    );
  };

  const renderedPrices = () => {
    const variantPrices = [];

    product.variants.filter((variant) => {
      if (variant.price > 0) {
        return variantPrices.push(variant.price);
      } else {
        return product.price;
      }
    });
    if (variantPrices.length > 0) {
      const min = () => variantPrices.reduce((x, y) => Math.min(x, y));
      const max = () => variantPrices.reduce((x, y) => Math.max(x, y));
      return (
        <ListGroup.Item className="price-tag">
          <div className="p-2">{"de " + min() + " à " + max() + " €"}</div>
        </ListGroup.Item>
      );
    } else {
      if (product.price && (!product.promoPrice || !product.soldePrice)) {
        return (
          <ListGroup.Item className="price-tag">
            <div className="p-2">{product.price} &euro;</div>
          </ListGroup.Item>
        );
      } else if (product.price && product.promoPrice) {
        return <div>{product.soldePrice}</div>;
      }
    }
  };

  const vignette = () => {
    return [product.image, ...product.images].map((x) => {
      return (
        <div
          role="button"
          className="my-2 btn btn-sm"
          key={x}
          onClick={() => setSelectedImage(x)}
        >
          <LazyLoadImage
            src={x}
            alt="product"
            className="img-vignette-product"
            placeholderSrc="../Spinner.svg"
          />
        </div>
      );
    });
  };

  const renderCarouselVignettes = () => {
    if (product.images.length >= 4) {
      return (
        <SlickCarousel
          {...{
            speed: 500,
            infinite: false,
            dots: true,
            slidesToShow: 4,
            slidesToScroll: 1,
          }}
          className="d-flex d-md-none"
        >
          {vignette()}
        </SlickCarousel>
      );
    } else if (product.images.length >= 1) {
      return (
        <div className="justify-content-between d-flex d-md-none">
          {vignette()}
        </div>
      );
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container className="my-5">
      <Breadcrumb className="d-none d-md-flex">
        <LinkContainer to={"/"} exact>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={"/boutique/search"}>
          <Breadcrumb.Item>Boutique</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`/boutique/search?category=${product.category}`}>
          <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer
          to={`/boutique/search?category=${product.category}&subCategory=${product.subCategory}`}
        >
          <Breadcrumb.Item>{product.subCategory}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Row className="product-infos">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <Link to="/boutique/search">
              <FontAwesomeIcon icon={faBackward} /> retour
            </Link>
          </div>
          <div>
            {userInfo && userInfo.isAdmin && (
              <Link to={`/admin/product/${product._id}`}>
                <Button>Editer</Button>
              </Link>
            )}
          </div>
        </div>

        <Col md={2} className="product-vignettes">
          <div className="d-flex flex-column align-items-end">{vignette()}</div>
        </Col>
        <Col md={4} className="mt-2">
          <div>
            <LazyLoadImage
              src={selectedImage || product.image}
              alt={product.name}
              className="product-page-main-image img-fluid"
              placeholderSrc="../Spinner.svg"
            />
          </div>
          {renderCarouselVignettes()}
        </Col>

        <Col md={6} className="mt-2">
          <ListGroup>
            <ListGroup.Item>
              <div className="d-flex justify-content-between align-items-center p-2">
                <div>
                  <h1 className="h2 mb-3">{product.name}</h1>
                  <h2 className="h6 text-muted">
                    {product.category}
                    {product.subCategory ? " - " + product.subCategory : ""}
                  </h2>
                </div>
              </div>

              <div className="p-2 d-flex justify-content-between">
                {product.variants.reduce(
                  (countInStock, variant) =>
                    countInStock + variant.countInStock,
                  product.countInStock
                ) > 0 ? (
                  <span className="badge-stock">En stock</span>
                ) : (
                  <span className="badge-epuise">Epuisé</span>
                )}
                <div>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </div>
              </div>
            </ListGroup.Item>

            {!product.promoPrice && !product.soldePrice && renderedPrices()}
            {product.promoPrice && (
              <>
                <ListGroup.Item className="price-tag">
                  <div className="text-nowrap p-2 rounded-5">
                    <s className="p-2">{product.price} &euro;</s>
                    <b>{product.promoPrice} &euro;</b>
                  </div>
                </ListGroup.Item>
              </>
            )}
            {product.soldePrice && (
              <>
                <ListGroup.Item className="price-tag">
                  <div className="text-nowrap p-2 rounded-5">
                    <s className="p-2">{product.price} &euro;</s>
                    <b>{product.soldePrice} &euro;</b>
                  </div>
                </ListGroup.Item>
              </>
            )}
            <ListGroup.Item>
              <div className="p-2">
                <p>{nl2br(product.description)}</p>
              </div>

              {product.variants.reduce(
                (countInStock, variant) => countInStock + variant.countInStock,
                product.countInStock
              ) > 0 ? (
                <>
                  {isBarrette() && (
                    <Form className="p-2">
                      <hr />
                      <div className="h5">
                        <span>Choisissez le style</span>
                      </div>
                      <Row>
                        <Col md={3}>
                          <Form.Check
                            name="side"
                            type="radio"
                            id="narrette-gauche"
                            label="Côté gauche"
                            value="Côté gauche"
                            onChange={(e) => {
                              setSide(e.target.value);
                            }}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Check
                            name="side"
                            type="radio"
                            id="barrette-droite"
                            label="Côté droit"
                            value="Côté droit"
                            onChange={(e) => {
                              setSide(e.target.value);
                            }}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Check
                            name="side"
                            type="radio"
                            id="broche"
                            label="Broche"
                            value="Broche"
                            onChange={(e) => {
                              setSide(e.target.value);
                            }}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Check
                            name="side"
                            type="radio"
                            id="roco"
                            label="Clic Clac"
                            value="Clic Clac"
                            onChange={(e) => {
                              setSide(e.target.value);
                            }}
                          />
                        </Col>
                      </Row>

                      <hr />
                    </Form>
                  )}

                  {renderVariationsAndPersonalisationForm()}
                </>
              ) : (
                ""
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              {product.variants.reduce(
                (countInStock, variant) => countInStock + variant.countInStock,
                product.countInStock
              ) > 0 ? (
                <div className="p-2">{renderAddToCartButton()}</div>
              ) : (
                <Button variant="secondary" disabled>
                  Epuisé
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <hr />

      <div className="my-3">
        <Row>
          <Col md={4}>
            <div className="mb-3 p-4">
              <h2 className="mb-4">Ajouter un avis</h2>

              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Note</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option disabled selected={!rating}>
                        Sélectionnez...
                      </option>
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
                  </Link>{" "}
                  pour rédiger un avis
                </MessageBox>
              )}
            </div>
          </Col>

          <Col md={8}>
            <div className="p-4 align-items-center">
              <h2 ref={reviewsRef} className="mb-4">
                Avis des clients
              </h2>
              {product.reviews.length === 0 ? (
                <MessageBox>
                  Il n'y a pas encore d'avis sur ce produit
                </MessageBox>
              ) : (
                renderCarouselReviews()
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
export default ProductPage;
