import axios from "axios";
import React, { useContext, useRef } from "react";
import { useState } from "react";
import { useReducer } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

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
    default:
      return state;
  }
};

export default function ReviewFormComponent() {
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  const [modalShow, setModalShow] = useState(false);
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  let reviewsRef = useRef();

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

  return (
    <div className="mb-3 p-4">
      <h2 className="mb-4">Ajouter un avis</h2>
      <Button
        className="w-100 btn-sm bg-white text-dark mb-2"
        variant="outline-secondary"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Laisser un avis sur le produit
      </Button>

      {userInfo ? (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <Form onSubmit={submitHandler}>
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
                  onClick={() => {
                    setModalShow(false);
                  }}
                >
                  Noter
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      ) : (
        <MessageBox>
          <Link to={`/signin?redirect=/product/${product.slug}`}>
            Connectez-vous
          </Link>{" "}
          pour rédiger un avis
        </MessageBox>
      )}
    </div>
  );
}
