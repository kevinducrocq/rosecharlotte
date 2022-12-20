import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ModalTissuPatch from "../components/ModalTissuPatch";
import { LazyLoadImage } from "react-lazy-load-image-component";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        tissus: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function TissuPage() {
  const [{ loading, error, tissus }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  const [modalShow, setModalShow] = useState(false);

  const [tissuImage, setTissuImage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const cardsPerRow = 8;

  const [next, setNext] = useState(cardsPerRow);

  const handleMoreCards = () => {
    setNext(next + cardsPerRow);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/tissus/");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>TissuThèque</title>
      </Helmet>

      <Container className="my-5">
        <Breadcrumb className="d-none d-md-flex">
          <LinkContainer to={"/"} exact>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Tissuthèque</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <section className="mt-5">
              <div className="d-flex justify-content-between">
                <h2>TissuThèque</h2>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un tissu..."
                  className="w-50"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>

              <Row className="mt-5">
                {(tissus && typeof tissus.map === "function" ? tissus : [])
                  .filter((val) => {
                    if (searchTerm === "") {
                      return val;
                    } else if (
                      val.name
                        .toLowerCase()
                        .includes(searchTerm.toLocaleLowerCase())
                    ) {
                      return val;
                    }
                    return "";
                  })
                  .slice(0, next)
                  .map((tissu, index) => {
                    return (
                      <Col key={index} md={4} sm={6} lg={3}>
                        <Card className="mb-3">
                          <Card.Header className="text-center">
                            <h2 className="h5">{tissu.name}</h2>
                          </Card.Header>
                          <div className="text-center">
                            {tissu.image ? (
                              <LazyLoadImage
                                value={tissu.name}
                                src={tissu.image}
                                role="button"
                                placeholderSrc="../Spinner.svg"
                                onClick={() => setModalShow(true)}
                                onClickCapture={(e) =>
                                  setTissuImage(e.target.src)
                                }
                                className="card-img-top img-fluid"
                              />
                            ) : (
                              <LazyLoadImage
                                className="images-tissu-motifs"
                                src="../images/no-image.png"
                                placeholderSrc="../Spinner.svg"
                              />
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
              </Row>
              {next < tissus?.length && (
                <div className="d-flex justify-content-center">
                  <Button
                    className="bg1 w-100 border-white text-white"
                    variant="bg1"
                    onClick={handleMoreCards}
                  >
                    Afficher plus
                  </Button>
                </div>
              )}
              <ModalTissuPatch
                show={modalShow}
                image={tissuImage}
                onHide={() => setModalShow(false)}
              />
            </section>
          </>
        )}
      </Container>
    </>
  );
}

export default TissuPage;
