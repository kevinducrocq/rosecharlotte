import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Image,
  InputGroup,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError, logOutAndRedirect } from '../../utils';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import {
  faEuroSign,
  faMinus,
  faPlus,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminMenu from '../../components/AdminMenu';
import ProductVariants from '../../components/ProductVariants';
import AdminCanvasMenu from '../../components/AdminCanvasMenu';

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

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingAdd, loadingUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
    }
  );

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [soldePrice, setSoldePrice] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [promoIsVisible, setPromoIsVisible] = useState(false);
  const [soldeIsVisible, setSoldeIsVisible] = useState(false);
  const [categoryInputIsVisible, setCategoryInputIsVisible] = useState(false);
  const [subCategoryInputIsVisible, setSubCategoryInputIsVisible] =
    useState(false);
  const [variantIsVisible, setVariantIsVisible] = useState(false);
  const [customizableIsVisible, setCustomizableIsVisible] = useState(false);
  const [priceIsVisible, setPriceIsVisible] = useState(false);
  const [variants, setVariants] = useState([]);
  const [customizable, setCustomizable] = useState(false);

  const [fils, setFils] = useState([]);
  const [tissus, setTissus] = useState([]);
  const [patches, setPatches] = useState([]);

  const [availableFils, setAvailableFils] = useState([]);
  const [availableTissus, setAvailableTissus] = useState([]);
  const [availablePatches, setAvailablePatches] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFils = async () => {
      try {
        const { data } = await axios.get('/api/fils', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setAvailableFils(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchFils({});
  }, [userInfo.token]);

  useEffect(() => {
    const fetchTissus = async () => {
      try {
        const { data } = await axios.get('/api/tissus', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setAvailableTissus(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchTissus({});
  }, [userInfo.token]);

  useEffect(() => {
    const fetchPatches = async () => {
      try {
        const { data } = await axios.get('/api/patches', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setAvailablePatches(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchPatches({});
  }, [userInfo.token]);

  useEffect(() => {
    setSubCategory(null);
  }, [category]);

  const renderedCategories = [];
  Object.keys(categories).forEach(function (mappedCategory) {
    renderedCategories.push(
      <option
        defaultValue={category === mappedCategory}
        key={mappedCategory}
        value={mappedCategory}
        onChange={(e) => setCategory(e.target.value)}
      >
        {mappedCategory}
      </option>
    );
  });

  const renderedSubCategories = [];
  Object.keys(categories).forEach(function (mappedCategory) {
    if (category === mappedCategory) {
      renderedSubCategories.push(
        <>
          {categories[mappedCategory].map((subCat) => {
            return (
              <option
                value={subCat}
                key={subCat}
                defaultValue={subCat === subCategory}
              >
                {subCat}
              </option>
            );
          })}
        </>
      );
    }
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/products/add`,
        {
          name,
          price,
          promoPrice,
          soldePrice,
          weight,
          image,
          images,
          category,
          subCategory,
          countInStock,
          description,
          variants,
          customizable,
          fils,
          tissus,
          patches,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // .catch(function (error) {
      //   if (error.response && error.response.status === 401) {
      //     logOutAndRedirect();
      //   }
      // });
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
      const { data } = await axios.post('/api/upload/image', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      // .catch(function (error) {
      //   if (error.response && error.response.status === 401) {
      //     logOutAndRedirect();
      //   }
      // });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.path]);
      } else {
        setImage(data.path);
      }
      toast.success('Image téléversée');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    setImages(images.filter((x) => x !== fileName));
  };

  const addNewVariants = () => {
    setVariants([
      ...variants,
      {
        name: '',
        countInStock: '',
        weight: '',
        price: '',
        promoPrice: '',
        soldePrice: '',
      },
    ]);
  };

  const removeVariant = async (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handlePrices = () => {
    return priceIsVisible;
  };

  return (
    <Container className="my-5">
      <Helmet>
        <title>Ajout d'un produit</title>
      </Helmet>

      <Row>
        <Col md={2}>
          <div className="d-none d-lg-block d-md-block">
            <AdminMenu link4 />
          </div>
          <div className="d-lg-none d-md-none text-nowrap mb-3">
            <AdminCanvasMenu />
          </div>
        </Col>
        <Col md={10} className="shadow p-5">
          <h1>Ajout d'un nouveau produit</h1>
          <hr />
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Form onSubmit={submitHandler}>
                <Row className="align-items-center">
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Nom du produit</Form.Label>
                      <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkBox"
                      id="custom-switch2"
                      label="Ce produit a des variantes"
                      onChange={() => {
                        setPriceIsVisible(!priceIsVisible);
                        setVariantIsVisible(!variantIsVisible);
                        if (!variantIsVisible && variants.length === 0) {
                          addNewVariants();
                        } else {
                          setVariants([]);
                        }
                      }}
                    />

                    <Form.Check
                      type="checkBox"
                      id="custom-switch"
                      label="Ce produit est personnalisable"
                      onChange={(e) => {
                        e ? setCustomizable(true) : setCustomizable(false);
                        setCustomizableIsVisible(!customizableIsVisible);
                      }}
                    />
                  </Col>
                  {variantIsVisible && (
                    <div className="bg-white my-3 p-4 rounded-3 border">
                      <Form.Check
                        className="mb-3"
                        type="checkBox"
                        id="custom-switch-3"
                        label="Même prix pour tous"
                        onChange={() => {
                          setPriceIsVisible(!priceIsVisible);
                          setPrice('');
                          setPromoPrice('');
                          setSoldePrice('');
                        }}
                      />
                      {variants.map((variant, key) => {
                        return (
                          <ProductVariants
                            variant={variant}
                            onChange={(v) => {
                              variants[key] = v;
                              setVariants(variants);
                            }}
                            key={key}
                            removeVariant={removeVariant}
                            handlePrices={handlePrices}
                          />
                        );
                      })}
                      <Button
                        onClick={() => {
                          addNewVariants();
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  )}{' '}
                  {!priceIsVisible && (
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="price">
                          <Form.Label>Prix</Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faEuroSign} />
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="promoPrice">
                          <Form.Label className="switch-price-2">
                            <Form.Check
                              type="switch"
                              id="promo-switch"
                              label="Prix promo ?"
                              onChange={() => {
                                setPromoIsVisible(!promoIsVisible);
                                if (promoIsVisible) {
                                  setPromoPrice('');
                                } else {
                                  setSoldeIsVisible(false);
                                  setSoldePrice('');
                                }
                              }}
                              checked={promoIsVisible}
                            />
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              value={promoPrice}
                              className={promoIsVisible ? '' : 'd-none'}
                              onChange={(e) => {
                                setPromoPrice(e.target.value);
                              }}
                              placeholder="€"
                            />
                            <InputGroup.Text
                              className={promoIsVisible ? '' : 'd-none'}
                            >
                              <FontAwesomeIcon icon={faEuroSign} />
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="soldePrice">
                          <Form.Label className="switch-price-2">
                            <Form.Check
                              type="switch"
                              id="solde-switch"
                              label="Prix soldé ?"
                              onChange={() => {
                                setSoldeIsVisible(!soldeIsVisible);
                                if (soldeIsVisible) {
                                  setSoldePrice('');
                                } else {
                                  setPromoIsVisible(false);
                                  setPromoPrice('');
                                }
                              }}
                              checked={soldeIsVisible}
                            />
                          </Form.Label>

                          <InputGroup>
                            <Form.Control
                              value={soldePrice}
                              className={soldeIsVisible ? '' : 'd-none'}
                              onChange={(e) => {
                                setSoldePrice(e.target.value);
                              }}
                              placeholder="€"
                            />
                            <InputGroup.Text
                              className={soldeIsVisible ? '' : 'd-none'}
                            >
                              <FontAwesomeIcon icon={faEuroSign} />
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <hr />
                    </Row>
                  )}
                  {customizableIsVisible && (
                    <div className="my-3 p-4 bg-white rounded-3 border">
                      <Row>
                        <Col className="bg-light p-3 rounded-3">
                          <div>
                            <strong className="text-center">
                              Fils disponibles
                            </strong>
                            <Form.Check
                              className="mb-3"
                              type="checkbox"
                              name="selectAllFils"
                              id="selectAllFils"
                              onChange={() => {
                                if (fils.length === availableFils.length) {
                                  setFils([]);
                                } else {
                                  setFils(
                                    availableFils.map((fil) => {
                                      return fil._id;
                                    })
                                  );
                                }
                              }}
                              checked={fils.length === availableFils.length}
                              label="Sélectionner tout"
                            />
                          </div>
                          <div className="colscroll">
                            {availableFils.map((fil) => {
                              return (
                                <Form.Check
                                  checked={fils.indexOf(fil._id) > -1}
                                  id={fil._id}
                                  key={fil._id}
                                  type="checkbox"
                                  name={fil.name}
                                  label={fil.name}
                                  onChange={(e) => {
                                    if (e.currentTarget.checked) {
                                      setFils([...fils, fil._id]);
                                    } else {
                                      fils.splice(fils.indexOf(fil), 1);
                                      setFils([...fils]);
                                    }
                                  }}
                                />
                              );
                            })}
                          </div>
                        </Col>

                        <Col className="bg-light p-3 rounded-3 mx-2">
                          <div>
                            <strong>Tissus disponibles</strong>
                            <Form.Check
                              className="mb-3"
                              type="checkbox"
                              name="selectAllTissus"
                              id="selectAllTissus"
                              onChange={() => {
                                if (tissus.length === availableTissus.length) {
                                  setTissus([]);
                                } else {
                                  setTissus(
                                    availableTissus.map((tissu) => {
                                      return tissu._id;
                                    })
                                  );
                                }
                              }}
                              checked={tissus.length === availableTissus.length}
                              label="Sélectionner tout"
                            />
                          </div>

                          <div className="colscroll">
                            {availableTissus.map((tissu) => {
                              return (
                                <Form.Check
                                  id={tissu._id}
                                  key={tissu._id}
                                  checked={tissus.indexOf(tissu._id) > -1}
                                  type="checkbox"
                                  name={tissu.name}
                                  label={tissu.name}
                                  onChange={(e) => {
                                    if (e.currentTarget.checked) {
                                      setTissus([...tissus, tissu._id]);
                                    } else {
                                      tissus.splice(tissus.indexOf(tissu), 1);
                                      setTissus([...tissus]);
                                    }
                                  }}
                                />
                              );
                            })}
                          </div>
                        </Col>

                        <Col className=" bg-light p-3 rounded-3">
                          <div>
                            <strong>Motifs disponibles</strong>
                            <Form.Check
                              className="mb-3"
                              type="checkbox"
                              name="selectAllMotifs"
                              id="selectAllMotifs"
                              onChange={() => {
                                if (
                                  patches.length === availablePatches.length
                                ) {
                                  setPatches([]);
                                } else {
                                  setPatches(
                                    availablePatches.map((patch) => {
                                      return patch._id;
                                    })
                                  );
                                }
                              }}
                              checked={
                                patches.length === availablePatches.length
                              }
                              label="Sélectionner tout"
                            />

                            <div className="colscroll">
                              {availablePatches.map((patch) => {
                                return (
                                  <Form.Check
                                    key={patch._id}
                                    id={patch._id}
                                    checked={patches.indexOf(patch._id) > -1}
                                    type="checkbox"
                                    name={patch.name}
                                    label={patch.name}
                                    onChange={(e) => {
                                      if (e.currentTarget.checked) {
                                        setPatches([...patches, patch._id]);
                                      } else {
                                        patches.splice(
                                          patches.indexOf(patch),
                                          1
                                        );
                                        setTissus([...patches]);
                                      }
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Row>
                {!variantIsVisible && (
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3" controlId="weight">
                        <Form.Label>Poids</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control
                            type="number"
                            min="0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                          />
                          <InputGroup.Text>grammes</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <hr />
                  </Row>
                )}

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
                    <Form.Group
                      className="mb-2"
                      controlId="additionalImageFile"
                    >
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
                        <Form.Label>Séléctionner une catégorie</Form.Label>
                        <Form.Select
                          aria-label="category select"
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option>Choisissez...</option>
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
                                setCategoryInputIsVisible(
                                  !categoryInputIsVisible
                                )
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
                              icon={
                                subCategoryInputIsVisible ? faMinus : faPlus
                              }
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
                  <Button disabled={loadingAdd} type="submit">
                    Ajouter
                  </Button>
                  {loadingAdd && <LoadingBox></LoadingBox>}
                </div>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
