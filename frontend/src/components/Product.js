import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product(props) {
  const { product } = props;

  return (
    <Card key={product.slug} className="hover-shadow">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top img-fluid"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>
          {!product.promoPrice && !product.soldePrice && (
            <Card.Text className="text-nowrap fw-bold bg3 p-2 rounded-5">
              {product.price} &euro;
            </Card.Text>
          )}
          {product.promoPrice && (
            <>
              <Card.Text className="text-nowrap fw-bold bg3 p-2 rounded-5">
                <s>{product.price} &euro;</s>
              </Card.Text>
              <Card.Text className="text-nowrap fw-bold bg3 p-2 rounded-5">
                {product.promoPrice} &euro;
              </Card.Text>
            </>
          )}
        </div>
        <div>
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>

        <div className="mt-2 mb-3">
          {product.countInStock > 0 ? (
            <Badge bg="success"> En stock</Badge>
          ) : (
            <Badge bg="danger">Epuisé</Badge>
          )}
        </div>

        <Link to={`/product/${product.slug}`}>
          <Button className="bg1 w-100" variant="outline-light">
            <FontAwesomeIcon icon={faEye} /> Voir
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
export default Product;
