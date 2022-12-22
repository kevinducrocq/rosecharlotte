import React from "react";
import { Button, Form } from "react-bootstrap";

export default function ReviewFormComponent() {
  return (
    <div className="mb-3 p-4">
      <h2 className="mb-4">Ajouter un avis</h2>

      {userInfo ? (
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
            >
              Noter
            </Button>
            {loadingCreateReview && <LoadingBox></LoadingBox>}
          </div>
        </Form>
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
